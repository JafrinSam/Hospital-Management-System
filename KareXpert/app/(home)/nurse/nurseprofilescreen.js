// screens/nurse/ProfileScreen.js
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../../context/AppContext';

export default function NurseProfileScreen() {
  const { user, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#2563eb', fontWeight: '700', fontSize: 16 }}>Loading nurse profile...</Text>
      </View>
    );
  }

  // Default fallbacks
  const nurseName = user?.displayName || 'Sree';
  const nurseId = user?.staffId || user?.id || 'RA2311003050018';
  const assignedRoom = '302A'; // You can fetch this dynamically if needed
  const shifts = [
    { day: 'Monday', shift: 'Morning (9:00am - 5:00pm)' },
    { day: 'Tuesday', shift: 'Morning (9:00am - 5:00pm)' },
    { day: 'Wednesday', shift: 'Evening (1:00pm - 9:00pm)' },
    { day: 'Thursday', shift: 'Morning (9:00am - 5:00pm)' },
    { day: 'Friday', shift: 'Morning (9:00am - 5:00pm)' },
    { day: 'Saturday', shift: 'Off' },
    { day: 'Sunday', shift: 'Off' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=47' }} // Placeholder image
            style={styles.photo}
          />
          <Text style={styles.name}>{nurseName}</Text>
          <Text style={styles.staffId}>Staff ID: {nurseId}</Text>
          <Text style={styles.room}>Assigned Room: {assignedRoom}</Text>
        </View>

        {/* Weekly Schedule */}
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Weekly Schedule</Text>
          {shifts.map((s, i) => (
            <View key={i} style={styles.shiftRow}>
              <Text style={styles.day}>{s.day}</Text>
              <Text style={styles.shift}>{s.shift}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  staffId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  room: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  shiftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  shift: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
});
