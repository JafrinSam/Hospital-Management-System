// File: /doctor/profile.js

import React from 'react';
import { Text, View, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../../../context/AppContext';

export default function DoctorProfileScreen() {
  const { user } = useAppContext();

  const doctor = {
    name: user?.displayName || 'Dr. Priya Sharma',
    staffId: user?.staffId || 'D12345',
    email: user?.email || 'dr.priya@example.com',
    phone: '+91 9876543210',
    department: 'Cardiology',
    profession: 'Cardiologist',
    experience: '12 years',
    bio: 'Dedicated cardiologist specializing in heart care, preventive cardiology, and patient wellness.',
    profilePic: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', // web image
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
        {/* Profile Picture */}
        <Image source={{ uri: doctor.profilePic }} style={styles.profilePic} />

        {/* Doctor Name */}
        <Text style={styles.name}>{doctor.name}</Text>
        <Text style={styles.profession}>{doctor.profession}</Text>

        {/* Card for Details */}
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Staff ID</Text>
            <Text style={styles.value}>{doctor.staffId}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{doctor.email}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{doctor.phone}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{doctor.department}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Experience</Text>
            <Text style={styles.value}>{doctor.experience}</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>About</Text>
            <Text style={styles.value}>{doctor.bio}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#2563eb',
    marginBottom: 16,
  },
  name: { fontSize: 26, fontWeight: '700', color: '#111827' },
  profession: { fontSize: 18, color: '#2563eb', marginBottom: 20 },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: '#6b7280', marginBottom: 4, fontWeight: '600' },
  value: { fontSize: 16, color: '#111827', fontWeight: '500' },
});
