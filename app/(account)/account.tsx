// app/(account)/account.tsx

import { useNavigation } from '@react-navigation/native'; import { useRouter, useFocusEffect } from 'expo-router'; import * as SecureStore from 'expo-secure-store'; import * as ImagePicker from 'expo-image-picker'; import React, { useCallback, useEffect, useLayoutEffect, useState, } from 'react'; import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, } from 'react-native'; import { Avatar, Button, Dialog, Portal } from 'react-native-paper'; import { MaterialCommunityIcons } from '@expo/vector-icons'; import Toast from 'react-native-toast-message'; import api from '../../lib/api';

export default function AccountScreen() { const [userName, setUserName] = useState<string | null>(null); const [avatarUri, setAvatarUri] = useState<string>(); const [loading, setLoading] = useState<boolean>(true); const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const router = useRouter(); const navigation = useNavigation();

// Hide bottom tabs useLayoutEffect(() => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }); return () => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } }); }; }, [navigation]);

// Load profile from API const loadProfile = useCallback(() => { (async () => { try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.get('/me', { headers: { Authorization: Bearer ${token} }, });

console.log('API response:', res.data);

    setUserName(res.data.name || null);
    setAvatarUri(res.data.avatar);
  } catch {
    Toast.show({
      type: 'error',
      text1: 'Failed to load profile',
      text2: 'Please check your internet or login again.',
      position: 'bottom',
    });
  } finally {
    setLoading(false);
  }
})();

}, []);

useEffect(() => { loadProfile(); }, [loadProfile]);

// Re-load on focus useFocusEffect( useCallback(() => { loadProfile(); }, [loadProfile]) );

// Image picker + upload const pickAndUploadAvatar = async () => { const perm = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!perm.granted) { Alert.alert('Permission required', 'Please allow photo access.'); return; }

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.7,
  allowsEditing: true,
});
if (result.canceled || !result.assets?.length) return;

const pickedUri = result.assets[0].uri;
const token = await SecureStore.getItemAsync('auth_token');
const form = new FormData();
form.append('avatar', {
  uri: pickedUri,
  name: 'avatar.jpg',
  type: 'image/jpeg',
} as any);

try {
  await api.post('/me/avatar', form, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  Toast.show({ type: 'successToast', text1: 'Avatar updated!' });
  loadProfile();
} catch {
  Toast.show({ type: 'errorToast', text1: 'Upload failed.' });
}

};

const handleNavigate = (path: string) => () => { router.push(path); };

const confirmLogout = async () => { await SecureStore.deleteItemAsync('auth_token'); setShowLogoutConfirm(false); Toast.show({ type: 'warningToast', text1: 'Logged out successfully' }); router.replace('/login'); };

if (loading) { return ( <View style={styles.loader}> <ActivityIndicator size="large" color="#bd93f9" /> </View> ); }

return null; // render logic omitted for brevity }

const styles = StyleSheet.create({ loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }, // other styles remain unchanged });

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
  },
  identityCard: {
    backgroundColor: '#282a36',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  identityLeft: {
    flexDirection: 'column',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountType: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  premiumBox: {
    backgroundColor: '#2e2e3e',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderColor: '#bd93f9',
    borderWidth: 1,
  },
  premiumText: {
    color: '#ff79c6',
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
  },
  premiumButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  premiumButton: {
    borderColor: '#6272a4',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchBox: {
    backgroundColor: '#2e2e3e',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  searchPlaceholder: {
    color: '#888',
    fontSize: 15,
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: '#282a36',
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 4,
  },
  sectionTitle: {
    color: '#f8f8f2',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 24,
    marginBottom: 6,
    paddingHorizontal: 18,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: '#f8f8f2',
    fontSize: 15,
  },
  itemArrow: {
    color: '#888',
    fontSize: 18,
  },
  logoutCard: {
    backgroundColor: '#282a36',
    margin: 16,
    borderRadius: 12,
    padding: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '600',
  },
  dialog: {
    backgroundColor: '#282a36',
    borderRadius: 12,
  },
  dialogTitle: {
    color: '#f8f8f2',
    fontWeight: 'bold',
  },
  dialogText: {
    color: '#ccc',
    fontSize: 15,
  },
  dialogActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dialogCancel: {
    backgroundColor: '#bd93f9',
    borderRadius: 6,
    marginRight: 8,
  },
  cancelLabel: {
    color: '#fff',
  },
  dialogConfirm: {
    borderColor: '#ff5555',
    borderWidth: 1,
    borderRadius: 6,
  },
  confirmLabel: {
    color: '#ff5555',
    fontWeight: 'bold',
  },
});