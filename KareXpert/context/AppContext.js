import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

const AppContext = createContext(null);

// --- New Storage Keys ---
const STORAGE_USER_KEY = 'user';
const STORAGE_TOKEN_KEY = 'accessToken';
const STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';
const STORAGE_PHONE_KEY = 'phone';
const STORAGE_DEVICE_ID_KEY = 'deviceId';
// ------------------------

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [phone, setPhoneState] = useState(null); // Added phone state
  const [isLoading, setIsLoading] = useState(true);

  const [deviceId, setDeviceId] = useState(null);
  const [deviceName, setDeviceName] = useState(null);
  const [pushToken, setPushToken] = useState(null);

  const isWeb = Platform.OS === 'web';

  const getFromStorage = async (key) => {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (e) {
      console.warn('getFromStorage error', key, e);
      return null;
    }
  };

  const saveToStorage = async (key, value) => {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (e) {
      console.warn('saveToStorage error', key, e);
    }
  };

  const removeFromStorage = async (key) => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (e) {
      console.warn('removeFromStorage error', key, e);
    }
  };

  /**
   * Safe lazy registration for push tokens.
   */
  const registerForPushNotificationsAsync = async () => {
    try {
      const appOwnership = Constants?.appOwnership ?? null;
      const runningInExpoGo = appOwnership === 'expo';
      if (runningInExpoGo) {
        console.log('Skipping push token registration (running in Expo Go).');
        return null;
      }
      if (isWeb) return null;
      let Notifications;
      try {
        Notifications = require('expo-notifications');
      } catch (e) {
        console.warn('expo-notifications not available via require()', e);
        return null;
      }
      if (!Notifications.getPermissionsAsync || !Notifications.requestPermissionsAsync) {
        console.warn('Notifications API not supported in this environment');
        return null;
      }
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Push notifications permission not granted');
        return null;
      }
      let tokenData;
      try {
        // This is the line that will FAIL and return null if your
        // projectId and google-services.json are missing.
        tokenData = await Notifications.getExpoPushTokenAsync();
      } catch (err) {
        console.warn('getExpoPushTokenAsync failed', err?.message ?? err);
        return null;
      }
      const token = tokenData?.data ?? null;
      try {
        if (
          Platform.OS === 'android' &&
          Notifications.setNotificationChannelAsync &&
          Notifications.AndroidImportance
        ) {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      } catch (e) {
        console.warn('setNotificationChannelAsync warning', e);
      }
      // If setup is correct, this will return a valid token
      // If setup is wrong, this will return null
      return token;
    } catch (e) {
      console.warn('registerForPushNotificationsAsync error', e);
      return null;
    }
  };

  // --- Updated useEffect to load session ---
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // ... (load persisted session logic) ...
        try {
          const token = await getFromStorage(STORAGE_TOKEN_KEY);
          const storedUser = await getFromStorage(STORAGE_USER_KEY);
          const storedPhone = await getFromStorage(STORAGE_PHONE_KEY);
          if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setPhoneState(storedPhone);
          }
        } catch (e) {
          console.warn('Failed to load persisted session', e);
        }

        // ... (load deviceId logic) ...
        let storedDeviceId = await getFromStorage(STORAGE_DEVICE_ID_KEY);
        if (!storedDeviceId) {
          try {
            storedDeviceId = Crypto.randomUUID();
          } catch (e) {
            storedDeviceId = `device-${Date.now()}`;
          }
          await saveToStorage(STORAGE_DEVICE_ID_KEY, storedDeviceId);
        }
        if (!cancelled) setDeviceId(storedDeviceId);

        // ... (load deviceName logic) ...
        let friendlyName = Platform.OS;
        try {
          if (Device && Device.modelName) {
            friendlyName = Device.modelName;
          } else if (Device && Device.manufacturer && Device.modelId) {
            friendlyName = `${Device.manufacturer} ${Device.modelId}`;
          }
        } catch (e) {
          /* fallback to Platform.OS */
        }
        if (!cancelled) setDeviceName(friendlyName);

        // ***** THIS IS THE CALL *****
        // 1. We call the function here during app start
        console.log('Attempting to register for push notifications...');
        const token = await registerForPushNotificationsAsync();

        // 2. We set the state with the result (which is `null` for you)
        if (token && !cancelled) {
          console.log('Push token acquired:', token);
          setPushToken(token);
        } else if (!cancelled) {
          console.log('Push token was null (check config / Expo Go).');
          setPushToken(null);
        }
        // ***************************
      } catch (e) {
        console.warn('AppProvider init error', e);
      } finally {
        // 3. ONLY after all of the above is done, we set loading to false.
        //    This correctly tells LoginScreen it's safe to proceed.
        if (!cancelled) setIsLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- New `signInWithTokens` function ---
  const signInWithTokens = async ({ accessToken, refreshToken }, userPayload) => {
    console.log('Signing in and storing tokens');
    try {
      // Save all pieces of data
      await saveToStorage(STORAGE_TOKEN_KEY, accessToken);
      await saveToStorage(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
      await saveToStorage(STORAGE_USER_KEY, JSON.stringify(userPayload));

      // Set state
      setUser(userPayload);
      console.log(userPayload);
    } catch (e) {
      console.error('Failed to sign in', e);
      throw new Error('Failed to save session'); // Re-throw so the UI can catch it
    }
  };

  // --- New `setPhone` function ---
  const setPhone = async (phoneValue) => {
    console.log('Storing phone number');
    try {
      await saveToStorage(STORAGE_PHONE_KEY, phoneValue);
      setPhoneState(phoneValue);
    } catch (e) {
      console.error('Failed to set phone', e);
    }
  };

  // --- Updated `logout` function ---
  const logout = async () => {
    console.log('Logging out and clearing tokens');
    try {
      // Clear state
      setUser(null);
      setPhoneState(null);

      // Clear all session data from storage
      await removeFromStorage(STORAGE_USER_KEY);
      await removeFromStorage(STORAGE_TOKEN_KEY);
      await removeFromStorage(STORAGE_REFRESH_TOKEN_KEY);
      await removeFromStorage(STORAGE_PHONE_KEY);
      // You might want to clear chat keys here too if you add them
    } catch (e) {
      console.error('Failed to log out', e);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      phone, // Added phone
      isLoading,
      signInWithTokens, // Replaced `login`
      setPhone, // Added `setPhone`
      logout,
      deviceId,
      deviceName,
      pushToken, // This is `null` until the function above succeeds
      // expose ownership so UI can show "push disabled in Expo Go"
      appOwnership: Constants?.appOwnership ?? null,
    }),
    [user, phone, isLoading, deviceId, deviceName, pushToken]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppProvider;
