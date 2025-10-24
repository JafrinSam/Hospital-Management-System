import '../global.css';
import { Stack } from 'expo-router'; // Import Stack
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppProvider from 'context/AppContext';
import { useAppContext } from 'context/AppContext';
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          {/* Only list screens that are in the root 'app' folder.
            The router will automatically find the (auth) and (home) groups.
          */}
          <Stack.Screen name="index" />

          {/* <== REMOVE THESE TWO LINES ==> */}
          {/* <Stack.Screen name="(auth)" /> */}
          {/* <Stack.Screen name="(home)" /> */}
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
