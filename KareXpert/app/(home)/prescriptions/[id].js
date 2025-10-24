import React from 'react';
import { Text, View, ScrollView, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router'; // Import hook to get ID
import { MOCK_PRESCRIPTIONS } from '../../../data/prescriptions'; // Get the same mock data

export default function PrescriptionDetail() {
  // 1. Get the 'id' from the URL
  const { id } = useLocalSearchParams();

  // 2. Find the correct prescription from the mock data
  const prescription = MOCK_PRESCRIPTIONS.find((rx) => rx.id === id);

  // Handle case where prescription isn't found
  if (!prescription) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'red' }}>Prescription not found.</Text>
      </SafeAreaView>
    );
  }

  // 3. Display the details
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      {/* Set the title of the page to the diagnosis */}
      <Stack.Screen options={{ title: prescription.diagnosis, headerBackTitle: 'Back' }} />
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#f3f4f6"
      />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Header Info */}
        <View
          style={{
            marginBottom: 24,
            paddingBottom: 24,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
          }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: '#111827' }}>
            {prescription.diagnosis}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 8 }}>
            Prescribed by: {prescription.doctor}
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
            Date: {prescription.date}
          </Text>
        </View>

        {/* Medications List */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
            Medications
          </Text>
          {prescription.medications.map((med) => (
            <MedicationCard
              key={med.name}
              name={med.name}
              dosage={med.dosage}
              frequency={med.frequency}
            />
          ))}
        </View>

        {/* Doctor's Notes */}
        <View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
            Doctor's Notes
          </Text>
          <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12 }}>
            <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24 }}>
              {prescription.notes}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable component for displaying a single medication
const MedicationCard = ({ name, dosage, frequency }) => (
  <View
    style={{
      backgroundColor: 'white',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    }}>
    <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{name}</Text>
    <Text style={{ fontSize: 16, color: '#374151', marginTop: 4 }}>{dosage}</Text>
    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{frequency}</Text>
  </View>
);
