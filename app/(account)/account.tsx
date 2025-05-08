// app/(account)/account.tsx

import { useNavigation } from '@react-navigation/native'; import { useRouter, useFocusEffect } from 'expo-router'; import * as SecureStore from 'expo-secure-store'; import * as ImagePicker from 'expo-image-picker'; import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'; import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, } from 'react-native'; import { Avatar, Button, Dialog, Portal } from 'react-native-paper'; import { MaterialCommunityIcons } from '@expo/vector-icons'; import Toast from 'react-native-toast-message'; import api from '../../lib/api';

export default function AccountScreen() { const [userName, setUserName] = useState<string | null>(null); const [avatarUri, setAvatarUri] = useState<string>(); const [loading, setLoading] = useState<boolean>(true); const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const router = useRouter(); const navigation = useNavigation();

useLayoutEffect(() => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }); return () => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } }); }; }, [navigation]);

const loadProfile = useCallback(async () => {
  try {
    const token = await SecureStore.getItemAsync('auth_token');
    const res = await api.get('/me', {
      headers: { Authorization: `Bearer ${token}` }, // ← fixed backticks here
    });
    setUserName(res.data.username || null);
    setAvatarUri(res.data.avatar);
  } catch {
    Alert.alert('Error', 'Unable to load profile.');
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => { loadProfile(); }, [loadProfile]);

useFocusEffect( useCallback(() => { loadProfile(); }, [loadProfile]) );

const pickAndUploadAvatar = async () => { const perm = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!perm.granted) { Alert.alert('Permission required', 'Please allow photo access.'); return; }

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaType.IMAGE,
  quality: 0.7,
  allowsEditing: true,
});

if (result.canceled) return;

const token = await SecureStore.getItemAsync('auth_token');
const form = new FormData();
form.append('avatar', {
  uri: result.assets[0].uri,
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

const handleNavigate = (path: string) => () => router.push(path);

const confirmLogout = async () => { await SecureStore.deleteItemAsync('auth_token'); setShowLogoutConfirm(false); Toast.show({ type: 'warningToast', text1: 'Logged out successfully' }); router.replace('/login'); };

if (loading) { return ( <View style={styles.loader}> <ActivityIndicator size="large" color="#bd93f9" /> </View> ); }

return ( <ScrollView style={styles.container}> <View style={styles.identityCard}> <View style={styles.identityLeft}> <Text style={styles.userName}>{userName || 'No name'}</Text> <Text style={styles.accountType}>Client account</Text> </View> <TouchableOpacity onPress={pickAndUploadAvatar}> <Avatar.Image size={60} source={ avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar-placeholder.png') } /> </TouchableOpacity> </View>

{/* Other sections omitted for brevity */}

  <View style={styles.logoutCard}>
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => setShowLogoutConfirm(true)}
    >
      <MaterialCommunityIcons
        name="logout"
        size={22}
        color="#ff6b6b"
        style={styles.logoutIcon}
      />
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  </View>

  <Portal>
    <Dialog
      visible={showLogoutConfirm}
      onDismiss={() => setShowLogoutConfirm(false)}
      style={styles.dialog}
    >
      <Dialog.Title style={styles.dialogTitle}>Confirm Logout</Dialog.Title>
      <Dialog.Content>
        <Text style={styles.dialogText}>Are you sure you want to log out?</Text>
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>
        <Button
          mode="contained"
          onPress={() => setShowLogoutConfirm(false)}
          style={styles.dialogCancel}
          labelStyle={styles.cancelLabel}
        >
          No
        </Button>
        <Button
          mode="outlined"
          onPress={confirmLogout}
          style={styles.dialogConfirm}
          labelStyle={styles.confirmLabel}
        >
          Yes
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
</ScrollView>

); }

// styles and helpers omitted for brevity

