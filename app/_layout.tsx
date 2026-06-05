import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';

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
    <UserProvider>
      <CartProvider>
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#121212' }
        }}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal', headerShown: false }} />
          <Stack.Screen name="subscription" options={{ presentation: 'fullScreenModal', headerShown: false }} />
          <Stack.Screen name="details" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="therapy" options={{ presentation: 'fullScreenModal', headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="tracking" options={{ headerShown: false }} />
          <Stack.Screen name="store" options={{ headerShown: false }} />
          <Stack.Screen name="stacked" options={{ headerShown: false }} />
          <Stack.Screen name="orders" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </CartProvider>
    </UserProvider>
  );
}
