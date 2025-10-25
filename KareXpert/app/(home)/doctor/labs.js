import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LabReportsScreen() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const dummyReports = [
      {
        id: 'l1',
        patient: 'Rohan Gupta',
        test: 'Complete Blood Count',
        type: 'Blood Test',
        date: '2025-10-20',
        doctor: 'Dr. Sharma',
        result: 'Normal',
        normalRange: 'WBC: 4.0-10.0, RBC: 4.5-5.5, Hemoglobin: 13-17'
      },
      {
        id: 'l2',
        patient: 'Sunita Patel',
        test: 'Chest X-Ray',
        type: 'Radiology',
        date: '2025-10-18',
        doctor: 'Dr. Sharma',
        result: 'No Issues',
        normalRange: 'No abnormal findings'
      },
    ];
    setReports(dummyReports);
  }, []);

  const handleDownload = (report) => {
    // Placeholder: implement actual download logic (PDF, etc.)
    Alert.alert('Download', `Lab report for ${report.patient} downloaded successfully.`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Lab Reports</Text>
        {reports.map(r => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.patientName}>{r.patient}</Text>
            <Text style={styles.info}>Test: {r.test}</Text>
            <Text style={styles.info}>Type: {r.type}</Text>
            <Text style={styles.info}>Date: {r.date}</Text>
            <Text style={styles.info}>Ordered by: {r.doctor}</Text>
            <Text style={styles.info}>Result: {r.result}</Text>
            <Text style={styles.info}>Normal Range: {r.normalRange}</Text>

            <TouchableOpacity style={styles.downloadButton} onPress={() => handleDownload(r)}>
              <Text style={styles.downloadButtonText}>Download Report</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1
  },
  patientName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  info: { fontSize: 14, color: '#374151', marginBottom: 2 },
  downloadButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  downloadButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
