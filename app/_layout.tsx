import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import auth from '@react-native-firebase/auth';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();
  const router = useRouter();
  const segments = useSegments();

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!user && inAuthGroup) {
      // Redirect to login if user is not logged in and trying to access tabs
      router.replace('/login');
    } else if (user && segments[0] !== '(tabs)') {
      // Redirect to home if user is logged in and trying to access landing/login
      router.replace('/(tabs)');
    }
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
