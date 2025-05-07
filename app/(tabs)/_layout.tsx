import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarShowLabel: true, // Show labels like WhatsApp
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: -4,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarActiveTintColor: '#bd93f9',   // Dracula purple
        tabBarInactiveTintColor: '#6272a4', // Muted Dracula blue

        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 70,
          backgroundColor: '#1e1e2f',
          borderRadius: 40,
          borderTopWidth: 0,
          paddingBottom: 4,
          paddingTop: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIcon: ({ color, focused }) => {
          let iconName: string;
          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'track':
              iconName = focused ? 'location' : 'location-outline';
              break;
            case 'chat':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'account':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="track" options={{ title: 'Track' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}