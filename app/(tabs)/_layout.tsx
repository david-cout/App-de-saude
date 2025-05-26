import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Home, Bell, User, MessageSquare, Info } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary.medium,
        tabBarInactiveTintColor: COLORS.neutral.darkGray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          backgroundColor: COLORS.background.secondary,
          borderTopWidth: 1,
          borderTopColor: COLORS.neutral.lightGray,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="city-info"
        options={{
          title: 'Cidade',
          tabBarIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}