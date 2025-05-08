// app/(account)/account.tsx

import { useNavigation } from '@react-navigation/native'; import { useRouter, useFocusEffect } from 'expo-router'; import * as SecureStore from 'expo-secure-store'; import * as ImagePicker from 'expo-image-picker'; import React, { useCallback, useEffect, useLayoutEffect, useState, } from 'react'; import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, } from 'react-native'; import { Avatar, Button, Dialog, Portal } from 'react-native-paper'; import { MaterialCommunityIcons } from '@expo/vector-icons'; import Toast from 'react-native-toast-message'; import api from '../../lib/api';

export default function AccountScreen() { const [userName, setUserName] = useState<string | null>(null); const [avatarUri, setAvatarUri] = useState<string>(); const [loading, setLoading] = useState<boolean>(true); const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const router = useRouter();
const navigation = useNavigation();

// Hide bottom tabs useLayoutEffect(() => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }); return () => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } }); }; }, [navigation]);

// Load profile from API const loadProfile = useCallback(async () => { try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.get('/me', { headers: { Authorization: Bearer ${token} }, }); setUserName(res.data.username || null); setAvatarUri(res.data.avatar); } catch { Alert.alert('Error', 'Unable to load profile.'); } finally { setLoading(false); } }, []);

useEffect(() => { loadProfile(); }, [loadProfile]);

// Re-load on focus useFocusEffect( useCallback(() => { loadProfile(); }, [loadProfile]) );

// Image picker + upload const pickAndUploadAvatar = async () => { const perm = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (!perm.granted) { Alert.alert('Permission required', 'Please allow photo access.'); return; }


  mediaTypes: ['photo'],
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,

  allowsEditing: true,
});

if (result.canceled || !result.assets?.length) return;

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

const handleNavigate = (path: string) => () => { router.push(path); };

const confirmLogout = async () => { await SecureStore.deleteItemAsync('auth_token'); setShowLogoutConfirm(false); Toast.show({ type: 'warningToast', text1: 'Logged out successfully' }); router.replace('/login'); };

if (loading) { return ( <View style={styles.loader}> <ActivityIndicator size="large" color="#bd93f9" /> </View> ); }

return ( <ScrollView style={styles.container}> {/* Profile Header */} <View style={styles.identityCard}> <View style={styles.identityLeft}> <Text style={styles.userName}>{userName || 'No name'}</Text> <Text style={styles.accountType}>Client account</Text> </View> <TouchableOpacity onPress={pickAndUploadAvatar}> <Avatar.Image size={60} source={ avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar-placeholder.png') } /> </TouchableOpacity> </View>

{/* Premium Box */}
  <View style={styles.premiumBox}>
    <Text style={styles.premiumText}>Amp up your profile</Text>
    <View style={styles.premiumButtons}>
      <Button
        mode="outlined"
        onPress={handleNavigate('/premium')}
        style={styles.premiumButton}
        labelStyle={{ color: '#ff79c6' }}
      >
        Premium
      </Button>
      <Button
        mode="outlined"
        onPress={handleNavigate('/shop')}
        style={styles.premiumButton}
        labelStyle={{ color: '#ffb86c' }}
      >
        Shop
      </Button>
    </View>
  </View>

  {/* Search Bar */}
  <View style={styles.searchBox}>
    <Text style={styles.searchPlaceholder}>Search</Text>
  </View>

  {/* Settings Sections */}
  <Section title="Account Settings">
    <SettingItem label="Account" onPress={handleNavigate('/settings/account')} />
    <SettingItem label="Content & Social" onPress={handleNavigate('/settings/content')} />
    <SettingItem label="Data & Privacy" onPress={handleNavigate('/settings/privacy')} />
    <SettingItem label="Authorized Apps" onPress={handleNavigate('/settings/apps')} />
    <SettingItem label="Devices" onPress={handleNavigate('/settings/devices')} />
    <SettingItem label="Connections" onPress={handleNavigate('/settings/connections')} />
    <SettingItem label="Clips" onPress={handleNavigate('/settings/clips')} />
    <SettingItem label="Scan QR Code" onPress={handleNavigate('/settings/qr')} />
  </Section>

  <Section title="Security">
    <SettingItem label="Security" onPress={handleNavigate('/settings/security')} />
    <SettingItem label="Change Password" onPress={handleNavigate('/settings/password')} />
    <SettingItem label="Two-Factor Authentication" onPress={handleNavigate('/settings/2fa')} />
    <SettingItem label="Privacy" onPress={handleNavigate('/settings/privacy')} />
    <SettingItem label="Blocked Accounts" onPress={handleNavigate('/settings/blocked')} />
  </Section>

  <Section title="App Settings">
    <SettingItem label="Voice" onPress={handleNavigate('/settings/voice')} />
    <SettingItem label="Appearance" onPress={handleNavigate('/settings/appearance')} />
    <SettingItem label="Accessibility" onPress={handleNavigate('/settings/accessibility')} />
    <SettingItem label="Language" onPress={handleNavigate('/settings/language')} />
    <SettingItem label="Chat" onPress={handleNavigate('/settings/chat')} />
    <SettingItem label="Web Browser" onPress={handleNavigate('/settings/browser')} />
    <SettingItem label="Notifications" onPress={handleNavigate('/settings/notifications')} />
    <SettingItem label="App Icon" onPress={handleNavigate('/settings/icon')} />
    <SettingItem label="Advanced" onPress={handleNavigate('/settings/advanced')} />
  </Section>

  <Section title="Support">
    <SettingItem label="Support" onPress={handleNavigate('/settings/support')} />
    <SettingItem label="Upload debug logs" onPress={handleNavigate('/settings/logs')} />
    <SettingItem label="Acknowledgements" onPress={handleNavigate('/settings/ack')} />
  </Section>

  <Section title="What's New">
    <SettingItem label="What’s New" onPress={handleNavigate('/settings/whats-new')} />
  </Section>

  {/* Log Out Button */}
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

  {/* Logout Confirm */}
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
        <Button mode="contained" onPress={() => setShowLogoutConfirm(false)} style={styles.noButton} labelStyle={styles.noLabel}>
          No
        </Button>
        <Button mode="outlined" onPress={confirmLogout} style={styles.yesButton} labelStyle={styles.yesLabel}>
          Yes
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
</ScrollView>

); }

const styles = StyleSheet.create({ loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }, container: { flex: 1, backgroundColor: '#1e1e2e' }, identityCard: { backgroundColor: '#282a36', margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }, identityLeft: { flexDirection: 'column' }, userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' }, accountType: { color: '#888', fontSize: 14, marginTop: 4 }, premiumBox: { backgroundColor: '#2e2e3e', margin: 16, borderRadius: 12, padding: 16, borderColor: '#bd93f9', borderWidth: 1, }, premiumText: { color: '#ff79c6', fontWeight: 'bold', marginBottom: 12, fontSize: 16 }, premiumButtons: { flexDirection: 'row', justifyContent: 'space-around' }, premiumButton: { borderColor: '#6272a4', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16 }, searchBox: { backgroundColor: '#2e2e3e', marginHorizontal: 16, marginTop: 8, marginBottom: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, }, searchPlaceholder: { color: '#888', fontSize: 15, fontStyle: 'italic' }, sectionCard: { backgroundColor: '#282a36', marginHorizontal: 12, borderRadius: 12, padding: 4 }, sectionTitle: { color: '#f8f8f2', fontWeight: 'bold', fontSize: 14, marginTop: 24, marginBottom: 6, paddingHorizontal: 18 }, item: { paddingVertical: 12, paddingHorizontal: 12 }, itemContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, itemText: { color: '#f8f8f2', fontSize: 15 }, itemArrow: { color: '#888', fontSize: 18 }, logoutCard: { backgroundColor: '#282a36', margin: 16, borderRadius: 12, padding: 12 }, logoutButton: { flexDirection: 'row', alignItems: 'center' }, logoutIcon: { marginRight: 12 }, logoutText: { color: '#ff6b6b', fontSize: 16, fontWeight: '600' }, dialog: { backgroundColor: '#282a36', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, }, dialogTitle: { color: '#f8f8f2', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }, dialogText: { color: '#ccc', fontSize: 15, marginBottom: 24 }, dialogActions: { flexDirection: 'row', justifyContent: 'space-evenly' }, noButton: { flex: 1, backgroundColor: '#44475a', borderRadius: 24, paddingVertical: 14, alignItems: 'center', minWidth: '40%' }, noLabel: { color: '#bd93f9', fontWeight: 'bold', fontSize: 16 }, yesButton: { flex: 1, borderColor: '#ff5555', borderWidth: 1, borderRadius: 24, paddingVertical: 14, alignItems: 'center', minWidth: '40%' }, yesLabel: { color: '#ff5555', fontWeight: 'bold', fontSize: 16 }, });

// Helper Section & SettingItem definitions function Section({ title, children }: { title: string; children: React.ReactNode; }) { return ( <> <Text style={styles.sectionTitle}>{title}</Text> <View style={styles.sectionCard}>{children}</View> </> ); }

function SettingItem({ label, onPress }: { label: string; onPress?: () => void; }) { return ( <TouchableOpacity style={styles.item} onPress={onPress}> <View style={styles.itemContent}> <Text style={styles.itemText}>{label}</Text> <Text style={styles.itemArrow}>›</Text> </View> </TouchableOpacity> ); }

