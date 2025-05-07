// components/AccountTabTrigger.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function AccountTabTrigger({ accessibilityState, ...props }: any) {
  const router = useRouter();
  const isFocused = accessibilityState?.selected;

  return (
    <TouchableOpacity
      {...props}
      onPress={() => {
        router.push('/(account)/account');
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons
          name={isFocused ? 'person' : 'person-outline'}
          size={22}
          color={isFocused ? '#bd93f9' : '#6272a4'}
        />
      </View>
    </TouchableOpacity>
  );
}
