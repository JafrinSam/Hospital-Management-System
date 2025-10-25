# app.py
import os
import joblib
import uvicorn
from fastapi import FastAPI, HTTPException, Body
from typing import Optional, List, Dict, Any
from pymongo import MongoClient
import numpy as np
import pandas as pd
import datetime

MODEL_PATH = os.getenv("MODEL_PATH", "model/triage_pipeline.joblib")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "triage_db")
APPOINT_COLLECTION = os.getenv("APPOINT_COLLECTION", "appointments")
API_KEY = os.getenv("API_KEY", None)  # optional simple auth

app = FastAPI(title="Triage Priority Microservice")

# ---- Load model (pipeline + label encoder + metadata) ----
pipeline = None
label_encoder = None
numeric_features = None
categorical_features = None
model_loaded = False
model_error = None

try:
    dump_obj = joblib.load(MODEL_PATH)
    pipeline = dump_obj.get('pipeline')
    label_encoder = dump_obj.get('label_encoder')
    numeric_features = dump_obj.get('numeric_features')
    categorical_features = dump_obj.get('categorical_features')
    if pipeline is None or label_encoder is None:
        raise ValueError("Model file does not contain required keys ('pipeline','label_encoder').")
    model_loaded = True
    print(f"Loaded model from {MODEL_PATH}")
except Exception as e:
    model_error = str(e)
    print(f"Model load failed: {model_error}. The service will still run but /predict will return 503 until model is available.")


# ---- DB client (used only if updates requested) ----
mongo = MongoClient(MONGO_URI)
db = mongo[DB_NAME]
appointments = db[APPOINT_COLLECTION]


def _extract_num(x):
    try:
        if isinstance(x, dict):
            for v in ['$numberDouble', '$numberInt', '$numberLong']:
                if v in x:
                    return float(x[v])
        return float(x)
    except:
        return np.nan


def make_input_df(records: List[dict]) -> pd.DataFrame:
    rows = []
    for r in records:
        d = r.copy()
        for c in ['BlooddpressurSystol', 'BlooddpressurDiastol', 'PulseRate',
                  'RespiratoryRate', 'Temperature', 'O2Saturation', 'AVPU']:
            d[c] = _extract_num(d.get(c, None))
        # ensure these exist (pipeline expects them)
        d.setdefault('age', np.nan)
        d.setdefault('gender', 'Unknown')
        d.setdefault('ChiefComplaint', 'Unknown')
        rows.append(d)
    df = pd.DataFrame(rows)
    return df


def compute_critical_flags(row: Dict[str, Any]) -> Dict[str, bool]:
    flags = {}
    try:
        flags['spO2_crit'] = (not pd.isna(row.get('O2Saturation'))) and (row.get('O2Saturation') < 90)
    except:
        flags['spO2_crit'] = False
    try:
        sbp = row.get('BlooddpressurSystol')
        flags['sbp_low_crit'] = (not pd.isna(sbp)) and (sbp < 90)
        flags['sbp_high_crit'] = (not pd.isna(sbp)) and (sbp > 180)
    except:
        flags['sbp_low_crit'] = flags['sbp_high_crit'] = False
    try:
        hr = row.get('PulseRate')
        flags['hr_low_crit'] = (not pd.isna(hr)) and (hr < 40)
        flags['hr_high_crit'] = (not pd.isna(hr)) and (hr > 130)
    except:
        flags['hr_low_crit'] = flags['hr_high_crit'] = False
    try:
        rr = row.get('RespiratoryRate')
        flags['rr_crit'] = (not pd.isna(rr)) and ((rr < 8) or (rr > 30))
    except:
        flags['rr_crit'] = False
    try:
        temp = row.get('Temperature')
        flags['temp_crit'] = (not pd.isna(temp)) and ((temp < 35) or (temp > 40))
    except:
        flags['temp_crit'] = False
    return flags


def decide_queue_action(pred_label: str, prob: float, flags: Dict[str, bool]) -> str:
    # Safety override: any critical flag => emergency
    if any(flags.values()):
        return 'promote_to_emergency'
    # thresholds (tune as needed)
    if pred_label == 'Emergency' and prob >= 0.5:
        return 'promote_to_emergency'
    if pred_label == 'HighRisk' and prob >= 0.5:
        return 'promote_to_high_risk'
    return 'none'


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model_loaded,
        "model_error": None if model_loaded else model_error
    }


@app.post("/predict")
def predict(records: List[dict] = Body(...), api_key: Optional[str] = None, apply_update: Optional[bool] = False):
    # simple API key check (optional)
    if API_KEY and api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not model_loaded:
        raise HTTPException(status_code=503, detail=f"Model not loaded: {model_error}")

    df_in = make_input_df(records)

    # create missingness indicators expected by pipeline
    for c in ['BlooddpressurSystol', 'BlooddpressurDiastol', 'PulseRate',
              'RespiratoryRate', 'Temperature', 'O2Saturation', 'AVPU']:
        df_in[f'{c}_missing'] = df_in[c].isna().astype(int)

    # add deterministic flags to input (pipeline expects these via remainder='passthrough')
    flags_list = []
    for i, r in df_in.iterrows():
        flags = compute_critical_flags(r.to_dict())
        flags_list.append(flags)
    flags_df = pd.DataFrame(flags_list)
    # concat so columns like 'spO2_crit' exist
    df_in = pd.concat([df_in.reset_index(drop=True), flags_df.reset_index(drop=True)], axis=1)

    # ensure expected columns exist (numeric & categorical)
    for c in (numeric_features or []):
        if c not in df_in.columns:
            df_in[c] = np.nan
    for c in (categorical_features or []):
        if c not in df_in.columns:
            df_in[c] = 'Unknown'

    # Run model (pipeline expects DataFrame with named columns)
    preds_encoded = pipeline.predict(df_in)
    probs = pipeline.predict_proba(df_in)

    # pipeline.named_steps['clf'].classes_ gives the encoded class order
    clf_classes = pipeline.named_steps['clf'].classes_
    # prepare mapping from encoded class (int) to position in prob array
    class_to_index = {int(c): idx for idx, c in enumerate(clf_classes)}

    results = []
    for i, rec in enumerate(records):
        encoded_pred = preds_encoded[i]
        # prob for the predicted encoded class
        prob = float(probs[i, class_to_index[int(encoded_pred)]]) if probs is not None else None
        pred_label = label_encoder.inverse_transform([int(encoded_pred)])[0]

        # recompute deterministic flags for readability (booleans)
        flags = compute_critical_flags(df_in.iloc[i].to_dict())
        queue_action = decide_queue_action(pred_label, prob if prob is not None else 0.0, flags)

        response = {
            "prediction": pred_label,
            "score": prob,
            "critical_flags": flags,
            "queue_action": queue_action
        }

        # Optionally apply DB update on appointment record
        if apply_update and rec.get('appointment_id'):
            appt_id = rec['appointment_id']
            action_map = {
                'promote_to_emergency': 'emergency',
                'promote_to_high_risk': 'high_risk',
                'none': None
            }
            target = action_map.get(queue_action)
            if target:
                res = appointments.update_one(
                    {"_id": appt_id},
                    {"$set": {"queue": target, "queue_updated_at": datetime.datetime.utcnow()}}
                )
                response['db_update'] = {"matched": res.matched_count, "modified": res.modified_count}
            else:
                response['db_update'] = {"matched": 0, "modified": 0}

        results.append(response)

    return {"results": results}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
