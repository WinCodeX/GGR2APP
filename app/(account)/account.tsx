import { useNavigation } from '@react-navigation/native'; import { useRouter } from 'expo-router'; import * as SecureStore from 'expo-secure-store'; import React, { useEffect, useLayoutEffect, useState } from 'react'; import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'; import { Avatar, Button, Dialog, Portal } from 'react-native-paper'; import { MaterialCommunityIcons } from '@expo/vector-icons'; import Toast from 'react-native-toast-message'; import api from '../../lib/api';

export default function AccountScreen() { const [userName, setUserName] = useState<string | null>(null); const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined); const [loading, setLoading] = useState<boolean>(true); const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

const router = useRouter(); const navigation = useNavigation();

// Hide the bottom tab bar on this screen useLayoutEffect(() => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }); return () => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } }); }; }, [navigation]);

// Fetch profile useEffect(() => { (async () => { try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.get('/me', { headers: { Authorization: Bearer ${token} }, }); setUserName(res.data.name || null); setAvatarUri(res.data.avatar_url); } catch { Alert.alert('Error', 'Unable to load profile.'); } finally { setLoading(false); } })(); }, []);

const handleNavigate = (path: string) => () => { router.push(path); };

const Section = ({ title, children, }: { title: string; children: React.ReactNode; }) => ( <> <Text style={styles.sectionTitle}>{title}</Text> <View style={styles.sectionCard}>{children}</View> </> );

const SettingItem = ({ label, onPress, }: { label: string; onPress?: () => void; }) => ( <TouchableOpacity style={styles.item} onPress={onPress}> <View style={styles.itemContent}> <Text style={styles.itemText}>{label}</Text> <Text style={styles.itemArrow}>›</Text> </View> </TouchableOpacity> );

const confirmLogout = async () => { // Delete token await SecureStore.deleteItemAsync('auth_token'); setShowLogoutConfirm(false); // Show yellow toast Toast.show({ type: 'warningToast', text1: 'Logged out successfully', }); // Navigate to login, replacing history router.replace('/login'); };

return ( <ScrollView style={styles.container}> {/* Profile Header */} <View style={styles.identityCard}> <View style={styles.identityLeft}> <Text style={styles.userName}> {loading ? 'Loading…' : userName || 'No name'} </Text> <Text style={styles.accountType}>Client account</Text> </View> <TouchableOpacity onPress={handleNavigate('/avatar')}> <Avatar.Image size={60} source={ avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar-placeholder.png') } /> </TouchableOpacity> </View>

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
    <SettingItem
      label="Content & Social"
      onPress={handleNavigate('/settings/content')}
    />
    <SettingItem
      label="Data & Privacy"
      onPress={handleNavigate('/settings/privacy')}
    />
    <SettingItem
      label="Authorized Apps"
      onPress={handleNavigate('/settings/apps')}
    />
    <SettingItem label="Devices" onPress={handleNavigate('/settings/devices')} />
    <SettingItem
      label="Connections"
      onPress={handleNavigate('/settings/connections')}
    />
    <SettingItem label="Clips" onPress={handleNavigate('/settings/clips')} />
    <SettingItem
      label="Scan QR Code"
      onPress={handleNavigate('/settings/qr')}
    />
  </Section>

  <Section title="Security">
    <SettingItem
      label="Security"
      onPress={handleNavigate('/settings/security')}
    />
    <SettingItem
      label="Change Password"
      onPress={handleNavigate('/settings/password')}
    />
    <SettingItem
      label="Two-Factor Authentication"
      onPress={handleNavigate('/settings/2fa')}
    />
    <SettingItem
      label="Privacy"
      onPress={handleNavigate('/settings/privacy')}
    />
    <SettingItem
      label="Blocked Accounts"
      onPress={handleNavigate('/settings/blocked')}
    />
  </Section>

  <Section title="App Settings">
    <SettingItem label="Voice" onPress={handleNavigate('/settings/voice')} />
    <SettingItem
      label="Appearance"
      onPress={handleNavigate('/settings/appearance')}
    />
    <SettingItem
      label="Accessibility"
      onPress={handleNavigate('/settings/accessibility')}
    />
    <SettingItem
      label="Language"
      onPress={handleNavigate('/settings/language')}
    />
    <SettingItem label="Chat" onPress={handleNavigate('/settings/chat')} />
    <SettingItem
      label="Web Browser"
      onPress={handleNavigate('/settings/browser')}
    />
    <SettingItem
      label="Notifications"
      onPress={handleNavigate('/settings/notifications')}
    />
    <SettingItem label="App Icon" onPress={handleNavigate('/settings/icon')} />
    <SettingItem
      label="Advanced"
      onPress={handleNavigate('/settings/advanced')}
    />
  </Section>

  <Section title="Support">
    <SettingItem label="Support" onPress={handleNavigate('/settings/support')} />
    <SettingItem
      label="Upload debug logs"
      onPress={handleNavigate('/settings/logs')}
    />
    <SettingItem
      label="Acknowledgements"
      onPress={handleNavigate('/settings/ack')}
    />
  </Section>

  <Section title="What's New">
    <SettingItem
      label="What's New"
      onPress={handleNavigate('/settings/whats-new')}
    />
  </Section>

  {/* Log Out Button Card */}
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

  {/* Confirmation Dialog */}
  <Portal>
    <Dialog
      visible={showLogoutConfirm}
      onDismiss={() => setShowLogoutConfirm(false)}
      style={styles.dialog}
    >
      <Dialog.Title style={styles.dialogTitle}>
        Confirm Logout
      </Dialog.Title>
      <Dialog.Content>
        <Text style={styles.dialogText}>
          Are you sure you want to log out?
        </Text>
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>
        <Button
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

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#1e1e2e', }, identityCard: { backgroundColor: '#282a36', margin: 16, borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }, identityLeft: { flexDirection: 'column', }, userName: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', }, accountType: { color: '#888888', fontSize: 14, marginTop: 4, }, premiumBox: { backgroundColor: '#2e2e3e', margin: 16, borderRadius: 12, padding: 16, borderColor: '#bd93f9', borderWidth: 1, }, premiumText: { color: '#ff79c6', fontWeight: 'bold', marginBottom: 12, fontSize: 16, }, premiumButtons: { flexDirection: 'row', justifyContent: 'space-around', }, premiumButton: { borderColor: '#6272a4', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, }, searchBox: { backgroundColor: '#2e2e3e', marginHorizontal: 16, marginTop: 8, marginBottom: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, }, searchPlaceholder: { color: '#888', fontSize: 15, fontStyle: 'italic', }, sectionCard: { backgroundColor: '#282a36', marginHorizontal: 12, borderRadius: 12, padding: 4, }, sectionTitle: { color: '#f8f8f2', fontWeight: 'bold', fontSize: 14, marginTop: 24, marginBottom: 6, paddingHorizontal: 18, }, item: { paddingVertical: 12, paddingHorizontal: 12, }, itemContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }, itemText: { color: '#f8f8f2', fontSize: 15, }, itemArrow: { color: '#888', fontSize: 18, }, logoutCard: { backgroundColor: '#282a36', margin: 16, borderRadius: 12, padding: 12, }, logoutButton: { flexDirection: 'row', alignItems: 'center', }, logoutIcon: { marginRight: 12, }, logoutText: { color: '#ff6b6b', fontSize: 16, fontWeight: '600', }, dialog: { backgroundColor: '#282a36', borderRadius: 12, }, dialogTitle: { color: '#f8f8f2', fontWeight: 'bold', }, dialogText: { color: '#ccc', fontSize: 15, }, dialogActions: { justifyContent: 'space-between', paddingHorizontal: 12, }, dialogCancel: { backgroundColor: '#bd93f9', borderRadius: 6, marginRight: 8, }, cancelLabel: { color: '#fff', }, dialogConfirm: { borderColor: '#ff5555', borderWidth: 1, borderRadius: 6, }, confirmLabel: { color: '#ff5555', fontWeight: 'bold', }, });


