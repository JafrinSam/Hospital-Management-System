import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PatientsListScreen() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [newPrescription, setNewPrescription] = useState('');

  useEffect(() => {
    const dummyPatients = [
      { 
        id: 'p1', 
        name: 'Rohan Gupta', 
        age: 35, 
        room: '302A', 
        contact: '9876543210', 
        vitals: { bp: '120/80', hr: 78, spo2: 98, temp: 98.6 }, 
        prescriptions: ['Paracetamol 500mg - 2x/day'] 
      },
      { 
        id: 'p2', 
        name: 'Sunita Patel', 
        age: 28, 
        room: '305B', 
        contact: '9123456780', 
        vitals: { bp: '110/70', hr: 80, spo2: 97, temp: 99.1 }, 
        prescriptions: ['Ibuprofen 400mg - 1x/day'] 
      },
    ];
    setPatients(dummyPatients);
  }, []);

  const handleSavePrescription = () => {
    if (!newPrescription.trim()) return;
    Alert.alert('Prescription Saved', `Prescription for ${selectedPatient.name} saved.`);
    setPatients(patients.map(p => p.id === selectedPatient.id 
      ? { ...p, prescriptions: [...p.prescriptions, newPrescription] } 
      : p
    ));
    setNewPrescription('');
  };

  const handleUpdateVitals = () => {
    Alert.alert('Vitals Updated', `Vitals for ${selectedPatient.name} updated.`);
    setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, vitals: selectedPatient.vitals } : p));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Patients List</Text>

        {patients.map(patient => (
          <TouchableOpacity 
            key={patient.id} 
            style={styles.card} 
            onPress={() => setSelectedPatient({...patient})} // clone to allow editing
          >
            <Text style={styles.name}>{patient.name}</Text>
            <Text>Room: {patient.room}</Text>
            <Text>Age: {patient.age}</Text>
          </TouchableOpacity>
        ))}

        {selectedPatient && (
          <View style={styles.details}>
            <Text style={styles.section}>Patient Details</Text>
            <Text>Name: {selectedPatient.name}</Text>
            <Text>Age: {selectedPatient.age}</Text>
            <Text>Room: {selectedPatient.room}</Text>
            <Text>Contact: {selectedPatient.contact}</Text>

            <Text style={styles.section}>Vitals</Text>
            <View style={styles.vitalsContainer}>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>BP</Text>
                <TextInput
                  style={styles.vitalInput}
                  value={selectedPatient.vitals.bp}
                  onChangeText={(text) => setSelectedPatient({ ...selectedPatient, vitals: { ...selectedPatient.vitals, bp: text } })}
                />
              </View>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>HR</Text>
                <TextInput
                  style={styles.vitalInput}
                  value={selectedPatient.vitals.hr.toString()}
                  onChangeText={(text) => setSelectedPatient({ ...selectedPatient, vitals: { ...selectedPatient.vitals, hr: Number(text) } })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>SpO₂</Text>
                <TextInput
                  style={styles.vitalInput}
                  value={selectedPatient.vitals.spo2.toString()}
                  onChangeText={(text) => setSelectedPatient({ ...selectedPatient, vitals: { ...selectedPatient.vitals, spo2: Number(text) } })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.vitalBox}>
                <Text style={styles.vitalLabel}>Temp</Text>
                <TextInput
                  style={styles.vitalInput}
                  value={selectedPatient.vitals.temp.toString()}
                  onChangeText={(text) => setSelectedPatient({ ...selectedPatient, vitals: { ...selectedPatient.vitals, temp: Number(text) } })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleUpdateVitals} style={styles.saveButton}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Update Vitals</Text>
            </TouchableOpacity>

            <Text style={styles.section}>Previous Prescriptions</Text>
            {selectedPatient.prescriptions.map((p, i) => (
              <TextInput
                key={i}
                value={p}
                style={styles.input}
                onChangeText={(text) => {
                  const updated = [...selectedPatient.prescriptions];
                  updated[i] = text;
                  setSelectedPatient({ ...selectedPatient, prescriptions: updated });
                }}
                multiline
              />
            ))}

            <Text style={styles.section}>Add New Prescription</Text>
            <TextInput 
              value={newPrescription} 
              onChangeText={setNewPrescription} 
              placeholder="Write prescription..." 
              style={styles.input} 
              multiline 
            />
            <TouchableOpacity onPress={handleSavePrescription} style={styles.saveButton}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Save Prescription</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  name: { fontSize: 16, fontWeight: '700' },
  details: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginTop: 16 },
  section: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12, minHeight: 40, marginBottom: 12, backgroundColor: '#f9fafb' },
  vitalsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  vitalBox: { flex: 1, backgroundColor: '#eef2ff', borderRadius: 12, padding: 10, marginHorizontal: 4, alignItems: 'center' },
  vitalLabel: { fontWeight: '700', color: '#1e40af', marginBottom: 4 },
  vitalInput: { width: '100%', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 6, backgroundColor: '#fff', textAlign: 'center' },
  saveButton: { backgroundColor: '#2563eb', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
});
