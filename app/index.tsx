import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // While loading, don't redirect
  if (isLoading) {
    return null;
  }

  // If user is authenticated, redirect to tabs/home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // If user is not authenticated, redirect to login
  return <Redirect href="/(auth)" />;
}