import React from 'react';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Skip onboarding carousel — go straight to login
  return <Redirect href="/login" />;
}
