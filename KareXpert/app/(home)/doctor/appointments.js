import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const dummyAppointments = [
      { id: 'a1', patient: 'Rohan Gupta', time: '10:00am', reason: 'Vitals Check', status: 'Pending Approval' },
      { id: 'a2', patient: 'Sunita Patel', time: '11:00am', reason: 'Follow-up', status: 'Pending Approval' },
    ];
    setAppointments(dummyAppointments);
  }, []);

  const handleStatusChange = (status) => {
    setAppointments(appointments.map(a => 
      a.id === selectedAppointment.id ? { ...a, status } : a
    ));
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.header}>Appointments</Text>
        {appointments.map(a => (
          <TouchableOpacity 
            key={a.id} 
            style={styles.card}
            onPress={() => {
              setSelectedAppointment(a);
              setModalVisible(true);
            }}
          >
            <Text style={styles.name}>{a.patient}</Text>
            <Text style={styles.info}>Time: {a.time}</Text>
            <Text style={styles.info}>Reason: {a.reason}</Text>
            <Text style={[
              styles.info, 
              a.status === 'Approved' ? styles.approved : 
              a.status === 'Scheduled for Tomorrow' ? styles.tomorrow :
              a.status === 'Scheduled for Day After Tomorrow' ? styles.dayAfter : styles.pending
            ]}>
              Status: {a.status}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Status Modal */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Status</Text>
              <Pressable style={styles.modalButton} onPress={() => handleStatusChange('Approved')}>
                <Text style={styles.modalButtonText}>Approve</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => handleStatusChange('Scheduled for Tomorrow')}>
                <Text style={styles.modalButtonText}>Schedule for Tomorrow</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={() => handleStatusChange('Scheduled for Day After Tomorrow')}>
                <Text style={styles.modalButtonText}>Schedule for Day After Tomorrow</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: '#f3f4f6' }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: '#111827' }]}>Cancel</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
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
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  info: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  approved: { color: '#16a34a', fontWeight: '600' },   // green
  pending: { color: '#f59e0b', fontWeight: '600' },    // yellow
  tomorrow: { color: '#3b82f6', fontWeight: '600' },   // blue
  dayAfter: { color: '#8b5cf6', fontWeight: '600' },   // purple

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  modalButton: { backgroundColor: '#2563eb', padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
