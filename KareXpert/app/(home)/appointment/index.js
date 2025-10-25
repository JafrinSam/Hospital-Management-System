import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Modal, // For the pop-up form
  TextInput, // For the form inputs
  KeyboardAvoidingView, // Added for keyboard handling in modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // --- ADDED for dropdowns ---

// --- Mock Data ---
// In a real app, this would come from your context or API
const MOCK_APPOINTMENTS_LIST = [
  {
    id: 'appt001',
    doctor: 'Dr. Anil Sharma',
    specialty: 'General Physician',
    date: 'October 28, 2025',
    time: '10:30 AM',
    reason: 'Follow-up Checkup',
  },
  {
    id: 'appt002',
    doctor: 'Dr. Meena Gupta',
    specialty: 'Cardiologist',
    date: 'November 05, 2025',
    time: '02:00 PM',
    reason: 'Annual Heart Screening',
  },
];

// --- Mock Data for Pickers ---
const DOCTORS_LIST = [
  { id: 'd0', name: 'Select a doctor...', specialty: '' },
  { id: 'd1', name: 'Dr. Anil Sharma', specialty: 'General Physician' },
  { id: 'd2', name: 'Dr. Meena Gupta', specialty: 'Cardiologist' },
  { id: 'd3', name: 'Dr. Rajesh Kumar', specialty: 'Dermatologist' },
];

const TIME_SLOTS = [
  'Select a time...',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
];

// Simple date generator for the next 7 days
const getNext7Days = () => {
  const days = ['Select a date...'];
  const today = new Date();
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date.toLocaleDateString('en-US', options));
  }
  return days;
};
const DATES_LIST = getNext7Days();
// -------------------

/**
 * ==========================================
 * Main Screen Component
 * ==========================================
 * This screen displays a list of appointments and
 * manages the modal for booking/editing.
 */
export default function MyAppointmentsScreen() {
  // State for the list of appointments
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS_LIST);
  // State to control the pop-up modal
  const [isModalVisible, setModalVisible] = useState(false);
  // State to track which appointment is being edited (null if booking a new one)
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // --- Functions to handle modal and data ---

  const handleOpenBookModal = () => {
    setSelectedAppointment(null); // Clear any selection
    setModalVisible(true); // Open the modal
  };

  const handleOpenEditModal = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setModalVisible(true); // Open the modal
  };

  const handleCancelAppointment = (id) => {
    // Filter out the cancelled appointment
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  const handleSubmitAppointment = (data) => {
    if (selectedAppointment) {
      // It's an EDIT
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === selectedAppointment.id ? { ...appt, ...data } : appt))
      );
    } else {
      // It's a NEW booking
      const newAppointment = {
        id: `appt${Math.random().toString(36).substr(2, 9)}`, // Create a random ID
        ...data,
      };
      setAppointments((prev) => [newAppointment, ...prev]);
    }
    setModalVisible(false); // Close the modal
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <Stack.Screen options={{ title: 'My Appointments' }} />
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#f3f4f6"
      />

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Button to book a new appointment */}
        <TouchableOpacity
          onPress={handleOpenBookModal}
          style={{
            backgroundColor: '#2563eb',
            padding: 16,
            borderRadius: 16,
            alignItems: 'center',
            marginBottom: 24,
          }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
            + Book New Appointment
          </Text>
        </TouchableOpacity>

        {/* List of upcoming appointments */}
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
          Upcoming
        </Text>
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onEdit={() => handleOpenEditModal(appt)}
              onCancel={() => handleCancelAppointment(appt.id)}
            />
          ))
        ) : (
          <Text style={{ color: '#6b7280', textAlign: 'center', padding: 20 }}>
            You have no upcoming appointments.
          </Text>
        )}
      </ScrollView>

      {/* The Booking/Editing Modal */}
      <AppointmentModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitAppointment}
        appointmentToEdit={selectedAppointment}
      />
    </SafeAreaView>
  );
}

/**
 * ==========================================
 * Component 1: Appointment Card
 * ==========================================
 * Displays details for a single appointment.
 */
const AppointmentCard = ({ appointment, onEdit, onCancel }) => {
  const { doctor, specialty, date, time } = appointment;

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}>
      {/* Appointment Details */}
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 }}>
        {doctor}
      </Text>
      <Text style={{ color: '#374151', fontSize: 16, marginBottom: 12 }}>{specialty}</Text>

      {/* Date and Time Box */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#f3f4f6',
          padding: 12,
          borderRadius: 10,
          marginBottom: 20,
        }}>
        <View>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Date</Text>
          <Text style={{ color: '#111827', fontSize: 16, fontWeight: '700' }}>{date}</Text>
        </View>
        <View>
          <Text style={{ color: '#6b7280', fontSize: 12 }}>Time</Text>
          <Text style={{ color: '#111827', fontSize: 16, fontWeight: '700' }}>{time}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={onCancel}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ef4444',
          }}>
          <Text style={{ color: '#ef4444', fontWeight: '700' }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onEdit}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            backgroundColor: '#3b82f6',
          }}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Reschedule / Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * ==========================================
 * Component 2: Appointment Modal (Form)
 * ==========================================
 * A pop-up form for booking or editing.
 */
const AppointmentModal = ({ visible, onClose, onSubmit, appointmentToEdit }) => {
  // Form state
  const [doctor, setDoctor] = useState(DOCTORS_LIST[0].name); // Default to "Select a doctor..."
  const [date, setDate] = useState(DATES_LIST[0]); // Default to "Select a date..."
  const [time, setTime] = useState(TIME_SLOTS[0]); // Default to "Select a time..."
  const [reason, setReason] = useState('');
  const [specialty, setSpecialty] = useState('');

  // Determine if this is an "Edit" or "Book" modal
  const isEditing = !!appointmentToEdit;
  const title = isEditing ? 'Edit Appointment' : 'Book New Appointment';

  // Pre-fill the form if we are editing an existing appointment
  useEffect(() => {
    if (appointmentToEdit) {
      setDoctor(appointmentToEdit.doctor);
      setDate(appointmentToEdit.date);
      setTime(appointmentToEdit.time);
      setReason(appointmentToEdit.reason);
      setSpecialty(appointmentToEdit.specialty);
    } else {
      // Reset form if booking a new one
      setDoctor(DOCTORS_LIST[0].name);
      setDate(DATES_LIST[0]);
      setTime(TIME_SLOTS[0]);
      setReason('');
      setSpecialty('');
    }
  }, [appointmentToEdit, visible]); // Re-run when the appointment or visibility changes

  const handleDoctorChange = (selectedDoctorName) => {
    setDoctor(selectedDoctorName);
    const selectedDoctor = DOCTORS_LIST.find((d) => d.name === selectedDoctorName);
    if (selectedDoctor) {
      setSpecialty(selectedDoctor.specialty); // Auto-fill specialty
    } else {
      setSpecialty('');
    }
  };

  const handleSubmit = () => {
    // Pass the form data back to the parent screen
    onSubmit({ doctor, specialty, date, time, reason });
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      {/* Use KeyboardAvoidingView to handle keyboard overlap */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, justifyContent: 'flex-end' }}
          onStartShouldSetResponder={onClose}
        />
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 24,
          }}>
          {/* Added a scrollview for when keyboard is open */}
          <ScrollView>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 24 }}>
              {title}
            </Text>

            {/* --- Form Inputs --- */}

            {/* Doctor Picker */}
            <Text style={styles.label}>Doctor</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={doctor}
                onValueChange={(itemValue) => handleDoctorChange(itemValue)}
                style={styles.picker}>
                {DOCTORS_LIST.map((doc) => (
                  <Picker.Item key={doc.id} label={doc.name} value={doc.name} />
                ))}
              </Picker>
            </View>

            {/* Specialty (Read-only, auto-filled) */}
            <Text style={styles.label}>Specialty</Text>
            <TextInput
              placeholder="Specialty"
              value={specialty}
              style={[styles.input, { backgroundColor: '#e5e7eb', color: '#6b7280' }]} // Make it look disabled
              editable={false}
            />

            {/* Date Picker */}
            <Text style={styles.label}>Date</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={date}
                onValueChange={(itemValue) => setDate(itemValue)}
                style={styles.picker}>
                {DATES_LIST.map((d) => (
                  <Picker.Item key={d} label={d} value={d} />
                ))}
              </Picker>
            </View>

            {/* Time Picker */}
            <Text style={styles.label}>Time</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={time}
                onValueChange={(itemValue) => setTime(itemValue)}
                style={styles.picker}>
                {TIME_SLOTS.map((t) => (
                  <Picker.Item key={t} label={t} value={t} />
                ))}
              </Picker>
            </View>

            {/* Reason Input */}
            <Text style={styles.label}>Reason for Visit</Text>
            <TextInput
              placeholder="Reason for Visit"
              value={reason}
              onChangeText={setReason}
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              multiline
            />

            {/* Modal Action Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, { backgroundColor: '#e5e7eb' }]}>
                <Text style={[styles.buttonText, { color: '#374151' }]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.button, { backgroundColor: '#2563eb' }]}>
                <Text style={[styles.buttonText, { color: 'white' }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Simple styles for the form
const styles = {
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16, // Increased margin
  },
  pickerContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginBottom: 16,
    justifyContent: 'center',
    // On iOS, the container clips the picker. On Android, the picker has its own background.
    ...(Platform.OS === 'android' && {
      height: 50, // Explicit height for Android
    }),
    ...(Platform.OS === 'ios' && {
      height: 200, // Taller height for iOS inline picker
      overflow: 'hidden',
    }),
  },
  picker: {
    // On Android, we style the picker itself
    ...(Platform.OS === 'android' && {
      height: 50,
      color: '#000',
    }),
    // On iOS, the picker items are styled, not the picker
    ...(Platform.OS === 'ios' &&
      {
        // No specific style needed for the picker, just the container
      }),
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
};
