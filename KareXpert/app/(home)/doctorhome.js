import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';

import { useAppContext } from '../../context/AppContext';
import { SearchIcon } from '../../components/SearchIcon';

export default function DoctorHomeScreen() {
  const router = useRouter();
  const { user, isLoading } = useAppContext();

  const [scannerVisible, setScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ data }) => {
    setScannedData(data);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 8, color: '#374151', fontWeight: '600' }}>
          Loading doctor data...
        </Text>
      </View>
    );
  }

  const doctorName = user?.displayName || 'Dr. Sharma';
  const doctorId = user?.staffId || user?.id || 'D12345';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{doctorName}</Text>
          </View>
          <View style={styles.headerIcons}>
            <SearchIcon color="#111827" size={22} />
            <TouchableOpacity onPress={() => setScannerVisible(true)}>
              <Ionicons name="scan-outline" size={36} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>{doctorId}</Text>
          <Text style={styles.overviewBigText}>{`Today's Schedule`}</Text>
          <Text style={styles.overviewSmallText}>9:00am to 6:00pm</Text>

          <TouchableOpacity
            onPress={() => router.push('/doctor/profile')}
            style={styles.viewScheduleButton}>
            <Text style={styles.viewScheduleText}>Doctor Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickActionButton title="Patients List" icon="👩‍⚕️" route="/doctor/patients" />
          <QuickActionButton title="Nurses List" icon="🧑‍⚕️" route="/doctor/nurses" />
          <QuickActionButton title="Appointments" icon="🗓️" route="/doctor/appointments" />
          <QuickActionButton title="Lab Reports" icon="🧪" route="/doctor/labs" />
        </View>

        {/* Patient Queue */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>Patient Queue</Text>
          <PatientQueueCard patientName="Rohan Gupta" reason="Vitals Check" roomNumber="302A" />
          <PatientQueueCard
            patientName="Sunita Patel"
            reason="Post-Op Follow-up"
            roomNumber="305B"
          />
          <PatientQueueCard patientName="Amit Singh" reason="Medication Admin" roomNumber="302A" />
          <PatientQueueCard
            patientName="Neha Sharma"
            reason="Pre-Surgery Vitals"
            roomNumber="308C"
          />
        </View>

        {/* Report an Issue */}
        <Pressable
          onPress={() => console.log('Issue Reported')}
          style={({ pressed }) => [styles.issueButton, { opacity: pressed ? 0.85 : 1 }]}>
          <Text style={styles.issueButtonText}>Report an Issue</Text>
        </Pressable>
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal visible={scannerVisible} transparent={true} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setScannerVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            {hasPermission ? (
              <Camera
                style={{ width: '100%', height: 400, borderRadius: 16 }}
                onBarCodeScanned={scannedData ? undefined : handleBarcodeScanned}
                barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
              />
            ) : (
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
                Camera permission denied
              </Text>
            )}

            {scannedData && (
              <View
                style={{ padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8, marginTop: 12 }}>
                <Text style={{ textAlign: 'center', fontSize: 16, color: '#111827' }}>
                  {scannedData}
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// QuickActionButton
const QuickActionButton = ({ title, icon, route }) => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => route && router.push(route)} style={styles.quickActionButton}>
      <Text style={{ fontSize: 36, marginBottom: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>{title}</Text>
    </TouchableOpacity>
  );
};

// PatientQueueCard
const PatientQueueCard = ({ patientName, reason, roomNumber }) => (
  <View style={styles.patientCard}>
    <View>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{patientName}</Text>
      <Text style={{ marginTop: 6, fontSize: 13, fontWeight: '600', color: '#6b7280' }}>
        Room: {roomNumber}
      </Text>
      <Text style={{ marginTop: 4, fontSize: 13, fontWeight: '600', color: '#2563eb' }}>
        Reason: {reason}
      </Text>
    </View>
    <Text style={{ fontSize: 20 }}>➡️</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: { color: '#6b7280', fontSize: 16 },
  nameText: { color: '#111827', fontSize: 28, fontWeight: '700' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  overviewCard: {
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  overviewTitle: {
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  overviewBigText: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 4 },
  overviewSmallText: { color: 'rgba(255,255,255,0.9)', marginBottom: 16 },
  viewScheduleButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewScheduleText: { color: '#2563eb', fontSize: 16, fontWeight: '700' },
  quickActions: {
    marginBottom: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    marginBottom: 16,
    height: 120,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#111827' },
  patientCard: {
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
  },
  issueButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  issueButtonText: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#111827' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 16,
    width: '90%',
    alignItems: 'center',
  },
});
