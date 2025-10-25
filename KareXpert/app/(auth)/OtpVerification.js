// src/screens/auth/OtpVerificationScreen.jsx (or .js)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
// 1. Import Expo Router hooks
import { useLocalSearchParams, useRouter } from 'expo-router';
import { verifyOtpApi } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const OtpVerificationScreen = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Add basic colors (theme removed)
  const colors = {
    background: '#ffffff',
    text: '#111827',
    textSecondary: '#9ca3af',
    border: '#e5e7eb',
    primary: '#2563eb',
  };

  // 3. Get params and router from Expo Router
  const params = useLocalSearchParams();
  const router = useRouter();
  const phone = params?.phone ?? '';

  // get functions from AppContext
  // This will now receive the functions we implemented
  const { deviceId, deviceName, signInWithTokens, setPhone, pushToken } = useAppContext();

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
      return;
    }
    if (!deviceId || !deviceName) {
      Alert.alert('Error', 'Device information is missing. Try restarting the app.');
      return;
    }

    setLoading(true);
    try {
      console.log(pushToken);

      const data = await verifyOtpApi(phone, otp, deviceId, deviceName, pushToken);

      const { accessToken, refreshToken, user } = data;
      if (!accessToken || !refreshToken) {
        setLoading(false); // Stop loading before showing alert
        Alert.alert('Error', 'Missing tokens from server response.');
        return;
      }

      // This will now correctly save the session
      await signInWithTokens({ accessToken, refreshToken }, user);

      try {
        // This will now correctly save the phone number
        if (typeof setPhone === 'function') await setPhone(phone);
      } catch (err) {
        console.warn('[OtpVerificationScreen] failed to persist phone to keystore', err);
      }

      // 4. Use router.replace to navigate to the main app layout
      //    This replaces the entire (auth) stack, so the user can't go "back"
      router.replace('/(home)');
    } catch (error) {
      Alert.alert('Error', error?.message ?? 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Verify OTP</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter the code sent to {phone}
      </Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        placeholder="Enter OTP"
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleVerifyOtp}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify & Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: { height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default OtpVerificationScreen;
