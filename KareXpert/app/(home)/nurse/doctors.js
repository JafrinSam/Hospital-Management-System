// screens/nurse/DoctorListScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const doctors = [
  { name: 'Dr. Rakesh Menon', specialization: 'Cardiologist', room: '201A', available: true },
  { name: 'Dr. Sneha Iyer', specialization: 'Neurologist', room: '205B', available: false },
  { name: 'Dr. Arjun Das', specialization: 'Orthopedic', room: '203C', available: true },
  { name: 'Dr. Priya Sharma', specialization: 'Pediatrician', room: '210D', available: true },
  { name: 'Dr. Vivek Nair', specialization: 'Dermatologist', room: '214E', available: false },
];

export default function DoctorListScreen() {
  const availableDoctors = doctors.filter((doc) => doc.available);
  const unavailableDoctors = doctors.filter((doc) => !doc.available);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Doctors Availability</Text>

        {/* Available Doctors */}
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#16a34a', marginBottom: 12 }}>
          🟢 Available Doctors
        </Text>

        {availableDoctors.length > 0 ? (
          availableDoctors.map((doc, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{doc.name}</Text>
                <Text style={styles.available}>🟢 Available</Text>
              </View>
              <Text style={styles.detail}>{doc.specialization}</Text>
              <Text style={styles.room}>Room: {doc.room}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noneText}>No doctors are currently available.</Text>
        )}

        {/* Unavailable Doctors */}
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#dc2626', marginTop: 24, marginBottom: 12 }}>
          🔴 On Duty Doctors
        </Text>

        {unavailableDoctors.length > 0 ? (
          unavailableDoctors.map((doc, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{doc.name}</Text>
                <Text style={styles.unavailable}>🔴 On Duty</Text>
              </View>
              <Text style={styles.detail}>{doc.specialization}</Text>
              <Text style={styles.room}>Room: {doc.room}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noneText}>All doctors are currently available.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  detail: { marginTop: 6, fontSize: 14, color: '#2563eb', fontWeight: '600' },
  room: { marginTop: 4, fontSize: 13, color: '#6b7280', fontWeight: '600' },
  available: { fontSize: 14, color: '#16a34a', fontWeight: '700' },
  unavailable: { fontSize: 14, color: '#dc2626', fontWeight: '700' },
  noneText: { fontSize: 16, color: '#6b7280', fontWeight: '600', marginBottom: 12 },
};
