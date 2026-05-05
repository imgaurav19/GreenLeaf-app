import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(false);
  const [user, setUser] = useState<any>(null); // Mock user for now
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(tabs)';

    // For now, let's allow access to tabs for testing
    // if (!user && inAuthGroup) {
    //   router.replace('/login');
    // } else if (user && segments[0] !== '(tabs)') {
    //   router.replace('/(tabs)');
    // }
  }, [user, initializing, segments]);

  if (initializing) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="subscription" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        <Stack.Screen name="details" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="therapy" options={{ presentation: 'fullScreenModal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
