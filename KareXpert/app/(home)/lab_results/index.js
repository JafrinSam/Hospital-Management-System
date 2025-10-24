import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal, // For the pop-up detail view
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

// --- Mock Data ---
// In a real app, this would come from your context or API

// This is the simple list for the main screen
const MOCK_REPORTS_LIST = [
  {
    id: 'lr001',
    testName: 'Complete Blood Count (CBC)',
    date: 'Oct 20, 2025',
    status: 'Available',
  },
  {
    id: 'lr002',
    testName: 'Lipid Profile',
    date: 'Oct 22, 2025',
    status: 'Pending',
  },
  {
    id: 'lr003',
    testName: 'Thyroid Panel (TSH)',
    date: 'Oct 18, 2025',
    status: 'Available',
  },
];

// This is the full, detailed data for the modal
const MOCK_REPORTS_DETAIL = {
  lr001: {
    id: 'lr001',
    testName: 'Complete Blood Count (CBC)',
    date: 'Oct 20, 2025',
    doctor: 'Dr. Anil Sharma',
    results: [
      { name: 'Hemoglobin', value: '15.2', unit: 'g/dL', range: '13.5 - 17.5', status: 'Normal' },
      { name: 'WBC Count', value: '12.5', unit: 'x10^9/L', range: '4.0 - 11.0', status: 'High' },
      { name: 'Platelets', value: '140', unit: 'x10^9/L', range: '150 - 450', status: 'Low' },
      { name: 'Hematocrit', value: '45.1', unit: '%', range: '40.0 - 50.0', status: 'Normal' },
    ],
    notes:
      'WBC count is slightly elevated, suggestive of a mild infection. Platelets are borderline low, recommend re-check in 1 week.',
  },
  lr003: {
    id: 'lr003',
    testName: 'Thyroid Panel (TSH)',
    date: 'Oct 18, 2025',
    doctor: 'Dr. Meena Gupta',
    results: [
      { name: 'TSH', value: '6.8', unit: 'mIU/L', range: '0.4 - 4.0', status: 'High' },
      { name: 'Free T4', value: '1.1', unit: 'ng/dL', range: '0.9 - 1.7', status: 'Normal' },
    ],
    notes:
      'TSH is elevated, indicating subclinical hypothyroidism. Patient to follow-up for further evaluation.',
  },
};
// -------------------

/**
 * ==========================================
 * Main Screen Component (List)
 * ==========================================
 */
export default function LabReportsScreen() {
  const [reports, setReports] = useState(MOCK_REPORTS_LIST);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // --- Functions to handle modal ---

  const handleOpenReport = (reportId) => {
    const detailData = MOCK_REPORTS_DETAIL[reportId];
    if (detailData) {
      setSelectedReport(detailData);
      setModalVisible(true);
    }
  };

  const handleCloseReport = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <Stack.Screen options={{ title: 'Lab Reports' }} />
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#f3f4f6"
      />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
          Your Reports
        </Text>

        {reports.map((report) => (
          <ReportListItemCard
            key={report.id}
            report={report}
            onPress={() => handleOpenReport(report.id)}
          />
        ))}
      </ScrollView>

      {/* The Detail Modal */}
      <LabReportDetailModal
        visible={isModalVisible}
        onClose={handleCloseReport}
        report={selectedReport}
      />
    </SafeAreaView>
  );
}

/**
 * ==========================================
 * Component 1: Report List Item Card
 * ==========================================
 */
const ReportListItemCard = ({ report, onPress }) => {
  const isAvailable = report.status === 'Available';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isAvailable}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        opacity: isAvailable ? 1.0 : 0.6,
      }}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{report.testName}</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>{report.date}</Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <ReportStatusBadge status={report.status} />
        {isAvailable && <Text style={{ fontSize: 20, color: '#6b7280', marginTop: 8 }}>➡️</Text>}
      </View>
    </TouchableOpacity>
  );
};

// Small helper for the "Available" / "Pending" badge
const ReportStatusBadge = ({ status }) => {
  const isAvailable = status === 'Available';
  const bgColor = isAvailable ? '#dcfce7' : '#e5e7eb'; // Green or Gray
  const textColor = isAvailable ? '#166534' : '#374151'; // Dark Green or Dark Gray

  return (
    <View
      style={{
        backgroundColor: bgColor,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 99,
      }}>
      <Text style={{ color: textColor, fontSize: 13, fontWeight: '700' }}>{status}</Text>
    </View>
  );
};

/**
 * ==========================================
 * Component 2: Report Detail Modal
 * ==========================================
 */
const LabReportDetailModal = ({ visible, onClose, report }) => {
  if (!report) return null; // Don't render anything if no report is selected

  return (
    <Modal
      animationType="slide"
      transparent={false} // Full screen
      visible={visible}
      onRequestClose={onClose}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          {/* Custom Header for the Modal */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
            <Text
              style={{ fontSize: 28, fontWeight: '800', color: '#111827', flex: 1 }}
              numberOfLines={2}>
              {report.testName}
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
              <Text style={{ fontSize: 28, color: '#6b7280' }}>&times;</Text>
            </TouchableOpacity>
          </View>

          {/* Report Info */}
          <View
            style={{
              marginBottom: 24,
              paddingBottom: 24,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            }}>
            <Text style={styles.detailLabel}>Ordered By</Text>
            <Text style={styles.detailValue}>{report.doctor}</Text>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{report.date}</Text>
          </View>

          {/* Results Table */}
          <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
            Results
          </Text>
          <View style={{ backgroundColor: 'white', borderRadius: 16, overflow: 'hidden' }}>
            {/* Table Header */}
            <View style={{ flexDirection: 'row', padding: 16, backgroundColor: '#f3f4f6' }}>
              <Text style={[styles.tableHeader, { flex: 2 }]}>Test</Text>
              <Text style={styles.tableHeader}>Value</Text>
              <Text style={styles.tableHeader}>Range</Text>
            </View>
            {/* Table Rows */}
            {report.results.map((result) => (
              <BiomarkerRow key={result.name} result={result} />
            ))}
          </View>

          {/* Doctor's Notes */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#111827',
              marginBottom: 12,
              marginTop: 32,
            }}>
            Doctor's Notes
          </Text>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 16 }}>
            <Text style={{ fontSize: 16, color: '#374151', lineHeight: 24 }}>{report.notes}</Text>
          </View>

          {/* Download Button (Demo) */}
          <TouchableOpacity
            style={{
              backgroundColor: '#2563eb',
              padding: 16,
              borderRadius: 16,
              alignItems: 'center',
              marginTop: 32,
              marginBottom: 24,
            }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
              Download PDF Report
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

/**
 * ==========================================
 * Component 3: Biomarker Row (for Modal)
 * ==========================================
 */
const BiomarkerRow = ({ result }) => {
  const statusColor =
    result.status === 'High'
      ? '#ef4444' // Red
      : result.status === 'Low'
        ? '#3b82f6' // Blue
        : '#10b981'; // Green for Normal

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
      }}>
      {/* Test Name */}
      <View style={{ flex: 2 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{result.name}</Text>
      </View>

      {/* Value (with status color) */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: statusColor }}>
          {result.value}
          <Text style={{ fontSize: 13, fontWeight: '500', color: '#6b7280' }}> {result.unit}</Text>
        </Text>
      </View>

      {/* Reference Range */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, color: '#6b7280' }}>{result.range}</Text>
      </View>
    </View>
  );
};

// Simple styles for the modal detail
const styles = {
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  tableHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
};
