import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // no top nav
        animation: 'slide_from_right', // optional: smooth transition
      }}
    />
  );
}
