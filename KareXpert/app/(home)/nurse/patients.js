// screens/nurse/PatientListScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const patients = [
  { id: 1, name: 'Rohan Gupta', age: 45, room: '302A', condition: 'Vitals Check' },
  { id: 2, name: 'Sunita Patel', age: 52, room: '305B', condition: 'Post Surgery' },
  { id: 3, name: 'Amit Singh', age: 60, room: '308C', condition: 'Diabetes Review' },
  { id: 4, name: 'Neha Sharma', age: 30, room: '310A', condition: 'Pre Surgery' },
];

export default function PatientListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>Patient List</Text>

        {patients.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.card}
            onPress={() => router.push({ pathname: '/nurse/patient-details', params: { ...p } })}
          >
            <Text style={styles.name}>{p.name}</Text>
            <Text style={styles.detail}>Age: {p.age}</Text>
            <Text style={styles.detail}>Room: {p.room}</Text>
            <Text style={[styles.detail, { color: '#2563eb' }]}>Condition: {p.condition}</Text>
          </TouchableOpacity>
        ))}
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
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  detail: { marginTop: 4, fontSize: 14, color: '#6b7280', fontWeight: '600' },
};
