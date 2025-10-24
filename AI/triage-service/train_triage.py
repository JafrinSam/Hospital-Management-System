# train_triage.py
import os
import joblib
import numpy as np
import pandas as pd
import warnings
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder, label_binarize
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from xgboost import XGBClassifier
from pymongo import MongoClient

# ---------- CONFIG ----------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "triage_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "patients")
SAVE_PATH = os.getenv("SAVE_PATH", "model/triage_pipeline.joblib")
RANDOM_STATE = int(os.getenv("RANDOM_STATE", "42"))
# ----------------------------

def fetch_from_mongo(uri=MONGO_URI, db=DB_NAME, collection=COLLECTION_NAME, limit=None):
    client = MongoClient(uri)
    coll = client[db][collection]
    if limit is None:
        cursor = coll.find({})
    else:
        cursor = coll.find({}, limit=int(limit))
    df = pd.DataFrame(list(cursor))
    client.close()
    return df


def make_features(df):
    """
    Lightweight feature extraction from raw MongoDB document.
    This extracts numeric vitals (flattening the {"$numberDouble": "..."} format),
    adds simple demographic fields, deterministic critical flags and missing indicators.
    """
    d = df.copy()

    # numeric columns we expect
    num_cols = ['BlooddpressurSystol', 'BlooddpressurDiastol', 'PulseRate',
                'RespiratoryRate', 'Temperature', 'O2Saturation', 'AVPU']

    # Flatten nested mongo number representations and cast to float (NaN on failure)
    def extract_num(x):
        if isinstance(x, dict):
            for v in ['$numberDouble', '$numberInt', '$numberLong']:
                if v in x:
                    try:
                        return float(x[v])
                    except:
                        return np.nan
        try:
            return float(x)
        except:
            return np.nan

    for c in num_cols:
        if c in d.columns:
            d[c] = d[c].apply(extract_num)
        else:
            # ensure column exists
            d[c] = np.nan

    # Basic demographics
    d['age'] = pd.to_numeric(d.get('age', pd.Series(np.nan)), errors='coerce')
    d['gender'] = d.get('gender', 'Unknown')
    d['ChiefComplaint'] = d.get('ChiefComplaint', 'Unknown')

    # Deterministic critical flags (safety overrides)
    flags = {}
    flags['spO2_crit'] = d['O2Saturation'] < 90
    flags['sbp_low_crit'] = d['BlooddpressurSystol'] < 90
    flags['sbp_high_crit'] = d['BlooddpressurSystol'] > 180
    flags['hr_low_crit'] = d['PulseRate'] < 40
    flags['hr_high_crit'] = d['PulseRate'] > 130
    flags['rr_crit'] = (d['RespiratoryRate'] < 8) | (d['RespiratoryRate'] > 30)
    flags['temp_crit'] = (d['Temperature'] < 35) | (d['Temperature'] > 40)
    for k, v in flags.items():
        # fillna False so comparisons with NaN don't propagate
        d[k] = v.fillna(False).astype(int)

    # Missingness indicators for each numeric vital
    for c in num_cols:
        d[f'{c}_missing'] = d[c].isna().astype(int)

    # Create target label from TriageGrade (modify mapping here if needed)
    # 1-2 Emergency, 3 HighRisk, 4-5 Routine
    d['TriageGrade'] = pd.to_numeric(d.get('TriageGrade', pd.Series(np.nan)), errors='coerce')

    def map_label(x):
        if (not np.isnan(x)) and (x <= 2):
            return 'Emergency'
        if x == 3:
            return 'HighRisk'
        return 'Routine'

    d = d[~d['TriageGrade'].isna()]  # drop unlabeled rows
    d['label'] = d['TriageGrade'].apply(map_label)

    return d


def make_onehot_encoder():
    """
    Construct OneHotEncoder in a back-compatible way:
    - older sklearns use `sparse=False`
    - newer sklearns use `sparse_output=False`
    We'll try `sparse` first, otherwise fall back to `sparse_output`.
    """
    try:
        ohe = OneHotEncoder(handle_unknown='ignore', sparse=False)
    except TypeError:
        # sklearn >= 1.2/1.3 style
        ohe = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
    return ohe


def build_pipeline(numeric_features, categorical_features):
    """
    Build ColumnTransformer-based preprocessing pipeline:
      - numeric: median impute + standard scale
      - categorical: constant impute + one-hot
    """
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median', add_indicator=False)),
        ('scaler', StandardScaler())
    ])
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
        ('onehot', make_onehot_encoder())
    ])
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough'  # keep any extras (like deterministic flags and missing indicators)
    )

    # XGBoost classifier (multi-class)
    model = XGBClassifier(n_estimators=200, use_label_encoder=False, eval_metric='mlogloss', random_state=RANDOM_STATE)
    pipeline = Pipeline(steps=[('preproc', preprocessor), ('clf', model)])
    return pipeline


def main():
    print("Fetching data...")
    df = fetch_from_mongo()
    print(f"Fetched {len(df)} records.")

    print("Building features...")
    df = make_features(df)
    print(f"After transformation: {len(df)} records.")

    # define features (these names must exist in df)
    numeric_features = ['age',
                        'BlooddpressurSystol', 'BlooddpressurDiastol', 'PulseRate',
                        'RespiratoryRate', 'Temperature', 'O2Saturation', 'AVPU']

    # categorical features
    categorical_features = ['gender', 'ChiefComplaint']

    # Ensure all expected columns exist in dataframe (this avoids KeyError)
    for c in numeric_features + categorical_features:
        if c not in df.columns:
            df[c] = np.nan

    # Build X and y (labels will be encoded)
    X = df[numeric_features + categorical_features +
           [c for c in df.columns if c.endswith('_missing')] +
           ['spO2_crit', 'sbp_low_crit', 'sbp_high_crit', 'hr_low_crit', 'hr_high_crit', 'rr_crit', 'temp_crit']]

    # Label encode target
    raw_y = df['label'].astype(str).values
    le = LabelEncoder()
    y = le.fit_transform(raw_y)  # numeric labels for xgboost

    # Train-test split with stratify on numeric labels
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=RANDOM_STATE)

    pipeline = build_pipeline(numeric_features, categorical_features)

    print("Training model...")
    pipeline.fit(X_train, y_train)

    print("Evaluating...")
    preds = pipeline.predict(X_test)  # encoded preds
    probs = pipeline.predict_proba(X_test)

    # ROC AUC for multiclass (binarize with classifier's classes to ensure consistent ordering)
    try:
        classes_in_model = pipeline.named_steps['clf'].classes_
        # classes_in_model are integers (0..n-1) — use them for binarize
        y_test_binarized = label_binarize(y_test, classes=classes_in_model)
        auc = roc_auc_score(y_test_binarized, probs, multi_class='ovr')
        print("ROC AUC (ovr):", auc)
    except Exception as e:
        warnings.warn(f"ROC AUC not computed: {e}")

    # classification report (decode labels for readability)
    decoded_y_test = le.inverse_transform(y_test)
    decoded_preds = le.inverse_transform(preds)
    print(classification_report(decoded_y_test, decoded_preds))

    # Persist pipeline AND label encoder together so inference can decode labels
    os.makedirs(os.path.dirname(SAVE_PATH) or '.', exist_ok=True)
    dump_obj = {
        'pipeline': pipeline,
        'label_encoder': le,
        'numeric_features': numeric_features,
        'categorical_features': categorical_features
    }
    joblib.dump(dump_obj, SAVE_PATH)
    print(f"Saved pipeline+label_encoder to {SAVE_PATH}")


if __name__ == "__main__":
    main()
