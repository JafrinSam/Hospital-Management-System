import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Initial empty form
const emptyPatientForm = {
  name: '',
  age: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
  aadharCardNumber: '',
  bloodGroup: '',
};

// API URL from env
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Placeholder color (darker gray)
const placeholderColor = '#6b7280';

export default function PatientManagementScreen() {
  const [formState, setFormState] = useState(emptyPatientForm);
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (field, value) => setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    // minimal validation
    if (!formState.name.trim()) {
      return Alert.alert('Validation', 'Please enter the full name.');
    }
    if (!formState.phone.trim()) {
      return Alert.alert('Validation', 'Please enter the phone number.');
    }

    const payload = { ...formState, age: parseInt(formState.age, 10) || 0 };

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || 'Failed to create patient');
      }

      const newPatient = await res.json();
      // We don't keep a local list here — just inform success and reset.
      Alert.alert('Success', 'Patient added successfully!');
      setFormState(emptyPatientForm);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not add patient. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.formContainer}>
          <Text style={styles.formHeader}>Add New Patient</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={placeholderColor}
            value={formState.name}
            onChangeText={(val) => handleFormChange('name', val)}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 8 }]}
              placeholder="Age"
              placeholderTextColor={placeholderColor}
              value={formState.age}
              onChangeText={(val) => handleFormChange('age', val)}
              keyboardType="number-pad"
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="Gender"
              placeholderTextColor={placeholderColor}
              value={formState.gender}
              onChangeText={(val) => handleFormChange('gender', val)}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={placeholderColor}
            value={formState.phone}
            onChangeText={(val) => handleFormChange('phone', val)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={placeholderColor}
            value={formState.email}
            onChangeText={(val) => handleFormChange('email', val)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor={placeholderColor}
            value={formState.address}
            onChangeText={(val) => handleFormChange('address', val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Aadhar Number"
            placeholderTextColor={placeholderColor}
            value={formState.aadharCardNumber}
            onChangeText={(val) => handleFormChange('aadharCardNumber', val)}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Blood Group"
            placeholderTextColor={placeholderColor}
            value={formState.bloodGroup}
            onChangeText={(val) => handleFormChange('bloodGroup', val)}
          />

          <View style={{ marginTop: 8 }}>
            {submitting ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button title="Add Patient" onPress={handleSubmit} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 1,
  },
  formHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#111827',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
});
