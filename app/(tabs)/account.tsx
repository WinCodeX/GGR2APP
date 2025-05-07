// /app/(tabs)/account.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function RedirectToAccount() {
  useEffect(() => {
    router.replace('/(account)/account');
  }, []);

  return null;
}
