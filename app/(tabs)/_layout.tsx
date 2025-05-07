import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

export default function TabLayout() {
  return (
    <View style={styles.wrapper}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#bd93f9',
          tabBarInactiveTintColor: '#6272a4',
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.tabItem}>
                <Ionicons name="home-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="track"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.tabItem}>
                <Ionicons name="location-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.tabItem}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.tabItem}>
                <Ionicons name="search-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.tabItem}>
                <Ionicons name="person-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#282a36',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#1e1e2f',
    borderRadius: 40,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderTopWidth: 0, // 🔥 removes the white line on Android
    ...Platform.select({
      ios: {
        shadowColor: '#000',
      },
      android: {
        elevation: 0,
      },
    }),
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});