// screens/nurse/ScheduleScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const schedules = [
  { time: '09:00 AM', patient: 'Rohan Gupta', task: 'Vitals Check', doctor: 'Dr. Rakesh Menon' },
  { time: '10:30 AM', patient: 'Neha Sharma', task: 'Pre Surgery Vitals', doctor: 'Dr. Priya Sharma' },
  { time: '12:00 PM', patient: 'Amit Singh', task: 'Glucose Monitoring', doctor: 'Dr. Arjun Das' },
  { time: '02:00 PM', patient: 'Sunita Patel', task: 'Post Op Review', doctor: 'Dr. Sneha Iyer' },
];

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }}>{`Today's Schedule`}</Text>

        {schedules.map((s, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.time}>{s.time}</Text>
            <Text style={styles.patient}>{s.patient}</Text>
            <Text style={styles.detail}>Task: {s.task}</Text>
            <Text style={styles.detail}>Doctor: {s.doctor}</Text>
          </View>
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
  time: { fontSize: 16, fontWeight: '700', color: '#2563eb' },
  patient: { fontSize: 17, fontWeight: '700', color: '#111827', marginTop: 4 },
  detail: { fontSize: 14, color: '#6b7280', marginTop: 4, fontWeight: '600' },
};
