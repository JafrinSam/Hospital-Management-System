import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Removed unused imports like Pressable, TouchableOpacity, and QrCodeLogo

// Ideally from auth/context/store
const patientName = 'Jane Doe';

// Mock vitals data. In a real app, this would come from your context or an API.
const vitalsData = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: '❤️' },
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: '🩸' },
  { label: 'SpO2', value: '98', unit: '%', icon: '💨' },
  { label: 'Temperature', value: '98.6', unit: '°F', icon: '🌡️' },
  { label: 'Glucose', value: '94', unit: 'mg/dL', icon: '🍬' },
  { label: 'Weight', value: '154', unit: 'lbs', icon: '⚖️' },
];

export default function Vitals() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      {/* Make statusbar match the app */}
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#f3f4f6"
      />

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        contentInsetAdjustmentBehavior="automatic">
        
        {/* Header */}
        <View
          style={{
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{ color: '#111827', fontSize: 28, fontWeight: '700' }}>{patientName}</Text>
            <Text style={{ color: '#6b7280', fontSize: 18, marginTop: 4 }}>Your Vitals</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Last updated: 2m ago</Text>
        </View>

        {/* Vitals Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {vitalsData.map((vital) => (
            <VitalDisplayCard
              key={vital.label}
              icon={vital.icon}
              label={vital.label}
              value={vital.value}
              unit={vital.unit}
            />
          ))}
        </View>
        
        {/* Removed Upcoming Appointment Card */}
        {/* Removed Quick Actions */}
        {/* Removed Recent Lab Results */}
        {/* Removed Help / File Query Button */}

      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable component to display a single, read-only vital
const VitalDisplayCard = ({ icon, label, value, unit }) => (
  <View
    style={{
      width: '48%', // Two columns
      marginBottom: 16,
      borderRadius: 20,
      backgroundColor: '#fff',
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    }}
    accessibilityRole="text"
    accessibilityLabel={`${label}: ${value} ${unit}`}>
    
    <Text style={{ fontSize: 32, marginBottom: 12 }}>{icon}</Text>
    
    <Text style={{ fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 4 }}>
      {label}
    </Text>
    
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: '#111827', lineHeight: 30 }}>
        {value}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginLeft: 4, marginBottom: 2 }}>
        {unit}
      </Text>
    </View>
  </View>
);
