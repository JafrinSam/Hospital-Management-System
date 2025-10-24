import { Stack } from 'expo-router';
import React from 'react';

export default function HomeLayout() {
  return (
    <Stack>
      {/* This screen configures the main (home)/index.js page */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* This screen configures the (home)/vitals.js page */}
      <Stack.Screen
        name="vitals"
        options={{
          title: 'Your Vitals',
          headerBackTitle: 'Back', // Adds a back button
        }}
      />

      {/* This automatically handles all screens inside /prescriptions */}
      <Stack.Screen
        name="prescriptions"
        options={{
          headerShown: false, // We'll let the screens inside handle their own titles
        }}
      />
    </Stack>
  );
}
