// screens/nurse/RegisterPatientScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterPatientScreen() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    roomNumber: '',
    bp: '',
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
  });

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleRegister = () => {
    const { name, age, gender, roomNumber, bp, heartRate, respiratoryRate, temperature } = form;

    if (!name || !age || !gender || !roomNumber) {
      Alert.alert('Missing Fields', 'Please fill all patient details.');
      return;
    }

    if (!bp || !heartRate || !respiratoryRate || !temperature) {
      Alert.alert('Missing Vitals', 'Please fill all initial vital details.');
      return;
    }

    Alert.alert(
      'Success',
      `${name} registered successfully!\n\nVitals Recorded:\nBP: ${bp}\nHR: ${heartRate}\nRR: ${respiratoryRate}\nTemp: ${temperature}°F`
    );

    // Reset form
    setForm({
      name: '',
      age: '',
      gender: '',
      roomNumber: '',
      bp: '',
      heartRate: '',
      respiratoryRate: '',
      temperature: '',
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Register New Patient</Text>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <TextInput
            placeholder="Patient Name"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Age"
            keyboardType="numeric"
            value={form.age}
            onChangeText={(v) => handleChange('age', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Gender (M/F)"
            value={form.gender}
            onChangeText={(v) => handleChange('gender', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Room Number"
            value={form.roomNumber}
            onChangeText={(v) => handleChange('roomNumber', v)}
            style={styles.input}
          />
        </View>

        {/* Vitals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Initial Vitals</Text>
          <TextInput
            placeholder="Blood Pressure (mmHg)"
            value={form.bp}
            onChangeText={(v) => handleChange('bp', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Heart Rate (bpm)"
            keyboardType="numeric"
            value={form.heartRate}
            onChangeText={(v) => handleChange('heartRate', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Respiratory Rate (breaths/min)"
            keyboardType="numeric"
            value={form.respiratoryRate}
            onChangeText={(v) => handleChange('respiratoryRate', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Temperature (°F)"
            keyboardType="numeric"
            value={form.temperature}
            onChangeText={(v) => handleChange('temperature', v)}
            style={styles.input}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register Patient</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
};
