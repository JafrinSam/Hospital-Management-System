// screens/nurse/PatientDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router'; // Assuming you have access to useRouter

// Inside your component function (e.g., VitalsScreen)
export default function PatientDetailsScreen() {
const router = useRouter();
  const params = useLocalSearchParams();
  const [vitals, setVitals] = useState({
    heartRate: '75',
    bp: '120/80',
    respRate: '16',
    temp: '98.6',
  });

  const handleChange = (key, value) => setVitals({ ...vitals, [key]: value });

const handleSave = () => {
  Alert.alert(
    'Vitals Updated',
    `New vitals for ${params.name} have been saved.`,
    // The third (optional) argument is an array of buttons. 
    // We define a single 'OK' button that calls the navigation function.
    [
      {
        text: 'OK',
        onPress: () => router.back(), // <-- This is the change
      },
    ],
    { cancelable: false } // Prevents dismissing the alert by tapping outside
  );
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827' }}>{params.name}</Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Age: {params.age}</Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Room: {params.room}</Text>
          <Text style={{ fontSize: 16, color: '#2563eb', marginTop: 4 }}>
            Condition: {params.condition}
          </Text>
        </View>

        {/* Editable vitals */}
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Vitals</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Heart Rate (bpm)</Text>
          <TextInput
            value={vitals.heartRate}
            onChangeText={(v) => handleChange('heartRate', v)}
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Blood Pressure (mmHg)</Text>
          <TextInput
            value={vitals.bp}
            onChangeText={(v) => handleChange('bp', v)}
            style={styles.input}
          />

          <Text style={styles.label}>Respiratory Rate (breaths/min)</Text>
          <TextInput
            value={vitals.respRate}
            onChangeText={(v) => handleChange('respRate', v)}
            style={styles.input}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Temperature (°F)</Text>
          <TextInput
            value={vitals.temp}
            onChangeText={(v) => handleChange('temp', v)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save Vitals</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  label: { fontSize: 15, fontWeight: '600', color: '#374151', marginTop: 10 },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
};
