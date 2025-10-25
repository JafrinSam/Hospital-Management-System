import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity, // Added for a tappable list
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router'; // Import useRouter for navigation
import { MOCK_PRESCRIPTIONS } from '../../../data/prescriptions'; // We'll create this mock data file

// Ideally from auth/context/store
const patientName = 'Jane Doe';

export default function PrescriptionsList() {
  const router = useRouter();

  // Function to handle tapping on a prescription
  const openPrescription = (id) => {
    // Navigate to the dynamic detail page, passing the id
    router.push(`(home)/prescriptions/${id}`);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      {/* Use Stack.Screen to set the title of this page */}
      <Stack.Screen options={{ title: 'Your Prescriptions' }} />
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#f3f4f6"
      />

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        contentInsetAdjustmentBehavior="automatic">
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#111827', fontSize: 28, fontWeight: '700' }}>{patientName}</Text>
          <Text style={{ color: '#6b7280', fontSize: 18, marginTop: 4 }}>Your Prescriptions</Text>
        </View>

        {/* Prescription List */}
        <View>
          {MOCK_PRESCRIPTIONS.map((rx) => (
            <PrescriptionListItem
              key={rx.id}
              date={rx.date}
              diagnosis={rx.diagnosis}
              doctor={rx.doctor}
              onPress={() => openPrescription(rx.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable component for the list
const PrescriptionListItem = ({ date, diagnosis, doctor, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      marginBottom: 12,
      borderRadius: 16,
      backgroundColor: '#fff',
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }}
    accessibilityRole="button"
    accessibilityLabel={`View prescription for ${diagnosis} from ${date}`}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
          {diagnosis}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
          {doctor}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#6b7280' }}>{date}</Text>
      </View>
      <Text style={{ fontSize: 20, color: '#9ca3af' }}>➡️</Text>
    </View>
  </TouchableOpacity>
);
