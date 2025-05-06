import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isAuthChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments(); // e.g. ['(tabs)', 'index']
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      const isAuth = !!token;
      setIsLoggedIn(isAuth);
      setAuthChecked(true);

      const inAuthGroup = segments[0] === '(auth)';
      const inTabGroup = segments[0] === '(tabs)';

      if (!isAuth && inTabGroup) {
        router.replace('/login');
      } else if (isAuth && inAuthGroup) {
        router.replace('/');
      }
    };

    checkSession();
  }, [segments]);

  if (!isAuthChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return <Slot />;
}
