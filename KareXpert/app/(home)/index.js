// screens/HomeScreen.js
import React, { useEffect } from 'react'; // Import useEffect
import {
  Text,
  View,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // 1. Import loading spinner
  StyleSheet, // 2. Import StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '../../context/AppContext'; // 3. Import your AppContext hook
import { QrCodeLogo } from '../../components/QrCodeLogo';
import SearchIcon from 'components/SearchIcon';

// This is no longer needed, we get it from context
// const patientName = 'Jane Doe';

export default function HomeScreen() {
  const router = useRouter();
  // 4. Get the user state and loading status from context
  const { user, isLoading } = useAppContext();
  console.log(user);

  // 5. Add effect to handle redirection
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'Patient':
          return;

        case 'Doctor':
          router.replace('(home)/doctorhome');
          break;

        case 'Nurse':
          router.replace('(home)/nursehome');
          break;

        default:
          router.replace('/(auth)/LoginScreen');
          break;
      }
    }

    // If we're done loading and there is NO user, redirect to login
    if (!isLoading && !user) {
      // Use 'replace' to prevent the user from navigating "back" to the home screen
      router.replace('/(auth)/LoginScreen');
    }
  }, [isLoading, user, router]); // Re-run this check when loading or user state changes

  // 6. Show a loading spinner while checking auth or if user is null (pre-redirect)
  if (isLoading || !user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  // 7. If we are NOT loading AND we have a user, render the Home Screen
  //    Get the patient name dynamically from the user object
  const patientName = user.displayName || 'Priya';
  const patientId = user.id || 'unknown'; // Assuming user object has an 'id'

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#f3f4f6"
      />

      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View
          style={{
            marginBottom: 32,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{ color: '#6b7280', fontSize: 16 }}>Welcome back,</Text>
            {/* Use the dynamic patientName here */}
            <Text style={{ color: '#111827', fontSize: 28, fontWeight: '700' }}>{patientName}</Text>
          </View>

          <View style={{ alignItems: 'center', flexDirection: 'row' }} className="gap-3">
            <SearchIcon color="#111827" size={22} />
            <QrCodeLogo
              // Use a dynamic user ID for the QR code
              value={`https://your-med-app.example/user/${encodeURIComponent(patientId)}`}
              size={50}
            />
          </View>
        </View>

        {/* ... [Rest of your UI code remains exactly the same] ... */}
        {/* Upcoming Appointment */}
        <View
          style={{
            marginBottom: 24,
            borderRadius: 20,
            backgroundColor: '#2563eb',
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 3,
          }}>
          <Text
            style={{
              color: 'rgba(255,255,255,0.85)',
              marginBottom: 8,
              fontSize: 16,
              fontWeight: '600',
            }}>
            Upcoming Appointment
          </Text>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 }}>
            Dr. Anil Sharma
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 12 }}>
            General Physician
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(0,0,0,0.12)',
              padding: 12,
              borderRadius: 10,
            }}
            accessibilityRole="text"
            accessibilityLabel="Appointment date and time">
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Date</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Oct 25, 2025</Text>
            </View>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>Time</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>10:30 AM</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={{
            marginBottom: 24,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          <QuickActionButton title="Book Appointment" icon="🗓️" route={'appointment'} />
          <QuickActionButton title="My Vitals" icon="❤️" route={'vitals'} />
          <QuickActionButton title="Prescriptions" icon="💊" route={'prescriptions'} />
          <QuickActionButton title="Lab Results" icon="🔬" route={'lab_results'} />
        </View>

        {/* Recent Lab Results */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#111827' }}>
            Recent Lab Results
          </Text>
          <ResultCard testName="Complete Blood Count (CBC)" status="View Report" />
          <ResultCard testName="Lipid Profile" status="Pending" />
        </View>

        {/* Help / File Query */}
        <Pressable
          onPress={() => {
            /* open support */
          }}
          accessibilityRole="button"
          style={({ pressed }) => ({
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            backgroundColor: '#fff',
            padding: 18,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 1,
            opacity: pressed ? 0.85 : 1,
          })}>
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#111827' }}>
            File a Complaint or Query
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

// 8. Add styles for the loading container
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Match your app's background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Reusable components (No changes needed here)
const QuickActionButton = ({ title, icon, route }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        if (route) {
          router.push(route);
        }
      }}
      className="mb-4 h-32 w-[48%] items-center justify-center rounded-2xl bg-white shadow-sm">
      <Text className="mb-2 text-4xl">{icon}</Text>
      <Text className="text-base font-semibold text-gray-800">{title}</Text>
    </TouchableOpacity>
  );
};

const ResultCard = ({ testName, status }) => (
  <View
    style={{
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      backgroundColor: '#fff',
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 1,
    }}
    accessibilityRole="summary">
    <View>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{testName}</Text>
      <Text
        style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: '600',
          color: status === 'Pending' ? '#6b7280' : '#2563eb',
        }}>
        Status: {status}
      </Text>
    </View>
    {status !== 'Pending' && <Text style={{ fontSize: 20 }}>➡️</Text>}
  </View>
);
