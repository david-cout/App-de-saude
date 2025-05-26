import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background.main },
        animation: 'fade',
      }}
    />
  );
}