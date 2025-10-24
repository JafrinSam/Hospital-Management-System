// src/context/AppContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [deviceId, setDeviceId] = useState(null);
  const [deviceName, setDeviceName] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [publicKey, setPublicKey] = useState(null);

  const STORAGE_DEVICE_ID_KEY = 'deviceId';
  const STORAGE_USER_KEY = 'user';

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
   * - Avoids importing expo-notifications at module top-level.
   * - Detects Expo Go at runtime using Constants.appOwnership and skips push in Expo Go.
   * - Returns null if push isn't possible.
   */
  const registerForPushNotificationsAsync = async () => {
    try {
      // evaluate ownership at runtime to avoid closure issues
      const appOwnership = Constants?.appOwnership ?? null;
      const runningInExpoGo = appOwnership === 'expo';

      if (runningInExpoGo) {
        console.log('Skipping push token registration (running in Expo Go). Use a development build to test push.');
        return null;
      }

      if (isWeb) {
        // Web push handled differently — skip here
        return null;
      }

      // lazy-require expo-notifications to avoid top-level side effects
      let Notifications;
      try {
        Notifications = require('expo-notifications');
      } catch (e) {
        console.warn('expo-notifications not available via require()', e);
        return null;
      }

      // ensure the methods we need exist
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

      // get expo push token (dev-client / standalone only)
      let tokenData;
      try {
        tokenData = await Notifications.getExpoPushTokenAsync();
      } catch (err) {
        console.warn('getExpoPushTokenAsync failed — check projectId / dev client', err?.message ?? err);
        return null;
      }
      const token = tokenData?.data ?? null;

      // Create Android channel if available
      try {
        if (Platform.OS === 'android' && Notifications.setNotificationChannelAsync && Notifications.AndroidImportance) {
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

      return token;
    } catch (e) {
      console.warn('registerForPushNotificationsAsync error', e);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // load persisted user
        try {
          const storedUser = await getFromStorage(STORAGE_USER_KEY);
          if (storedUser) setUser(JSON.parse(storedUser));
        } catch (e) {
          console.warn('Failed to load persisted user', e);
        }

        // load or create stable deviceId
        let storedDeviceId = await getFromStorage(STORAGE_DEVICE_ID_KEY);
        if (!storedDeviceId) {
          try {
            storedDeviceId = Crypto.randomUUID();
          } catch (e) {
            storedDeviceId = `device-${Date.now()}`;
            console.warn('Crypto.randomUUID failed, fallback id used', e);
          }
          await saveToStorage(STORAGE_DEVICE_ID_KEY, storedDeviceId);
        }
        if (!cancelled) setDeviceId(storedDeviceId);

        // friendly name
        let friendlyName = null;
        try {
          if (Device && Device.modelName) {
            friendlyName = Device.modelName;
          } else if (Device && Device.manufacturer && Device.modelId) {
            friendlyName = `${Device.manufacturer} ${Device.modelId}`;
          } else {
            friendlyName = Platform.OS;
          }
        } catch (e) {
          friendlyName = Platform.OS;
        }
        if (!cancelled) setDeviceName(friendlyName);

        // attempt to register for push token (safe lazy func)
        const token = await registerForPushNotificationsAsync();
        if (token && !cancelled) setPushToken(token);
      } catch (e) {
        console.warn('AppProvider init error', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // preserve the function names exactly
  const login = (email, password) => {
    console.log('Logging in with', email, password);
    try {
      const fakeUser = {
        id: '1',
        name: 'Test User',
        email,
      };
      setUser(fakeUser);
      saveToStorage(STORAGE_USER_KEY, JSON.stringify(fakeUser));
    } catch (e) {
      console.error('Failed to log in', e);
    }
  };

  const logout = () => {
    console.log('Logging out');
    try {
      setUser(null);
      removeFromStorage(STORAGE_USER_KEY);
    } catch (e) {
      console.error('Failed to log out', e);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      deviceId,
      deviceName,
      pushToken,
      publicKey,
      setPublicKey,
      // expose ownership so UI can show "push disabled in Expo Go"
      appOwnership: Constants?.appOwnership ?? null,
    }),
    [user, isLoading, deviceId, deviceName, pushToken, publicKey]
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
