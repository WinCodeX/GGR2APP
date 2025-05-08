import { useNavigation } from '@react-navigation/native'; import { useRouter } from 'expo-router'; import * as SecureStore from 'expo-secure-store'; import React, { useEffect, useLayoutEffect, useState } from 'react'; import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; import { Avatar, Button } from 'react-native-paper'; import { MaterialCommunityIcons } from '@expo/vector-icons'; import api from '../../lib/api';

export default function AccountScreen() { const [userName, setUserName] = useState<string | null>(null); const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined); const router = useRouter(); const navigation = useNavigation();

useLayoutEffect(() => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } }); return () => { navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } }); }; }, [navigation]);

useEffect(() => { (async () => { try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.get('/me', { headers: { Authorization: Bearer ${token} }, }); setUserName(res.data.name || null); setAvatarUri(res.data.avatar_url); } catch { Alert.alert('Error', 'Unable to load profile.'); } })(); }, []);

const handleNavigate = (path: string) => () => { router.push(path); };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => ( <> <Text style={styles.sectionTitle}>{title}</Text> <View style={styles.sectionCard}>{children}</View> </> );

const SettingItem = ({ label, icon, onPress }: { label: string; icon: string; onPress?: () => void }) => ( <TouchableOpacity style={styles.item} onPress={onPress}> <View style={styles.itemContent}> <MaterialCommunityIcons name={icon} size={20} color="#f8f8f2" style={styles.itemIcon} /> <Text style={styles.itemText}>{label}</Text> <Text style={styles.itemArrow}>›</Text> </View> </TouchableOpacity> );

return ( <ScrollView style={styles.container}> <View style={styles.identityCard}> <View style={styles.identityLeft}> <Text style={styles.userName}>{userName || 'No name'}</Text> <Text style={styles.accountType}>Client account</Text> </View> <TouchableOpacity onPress={handleNavigate('/avatar')}> <Avatar.Image size={60} source={avatarUri ? { uri: avatarUri } : require('../../assets/images/avatar-placeholder.png')} /> </TouchableOpacity> </View>

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

  <View style={styles.searchBox}>
    <Text style={styles.searchPlaceholder}>Search</Text>
  </View>

  <Section title="Account Settings">
    <SettingItem label="Account" icon="account" />
    <SettingItem label="Content & Social" icon="account-group-outline" />
    <SettingItem label="Data & Privacy" icon="shield-account" />
    <SettingItem label="Authorized Apps" icon="lock-outline" />
    <SettingItem label="Devices" icon="tablet" />
    <SettingItem label="Connections" icon="link-variant" />
    <SettingItem label="Clips" icon="scissors-cutting" />
    <SettingItem label="Scan QR Code" icon="qrcode-scan" />
  </Section>

  <Section title="Security">
    <SettingItem label="Security" icon="security" />
    <SettingItem label="Change Password" icon="form-textbox-password" />
    <SettingItem label="Two-Factor Authentication" icon="shield-key" />
    <SettingItem label="Privacy" icon="eye-off-outline" />
    <SettingItem label="Blocked Accounts" icon="account-cancel-outline" />
  </Section>

  <Section title="App Settings">
    <SettingItem label="Voice" icon="microphone" />
    <SettingItem label="Appearance" icon="palette" />
    <SettingItem label="Accessibility" icon="human" />
    <SettingItem label="Language" icon="translate" />
    <SettingItem label="Chat" icon="chat-outline" />
    <SettingItem label="Web Browser" icon="web" />
    <SettingItem label="Notifications" icon="bell-outline" />
    <SettingItem label="App Icon" icon="application" />
    <SettingItem label="Advanced" icon="cog-outline" />
  </Section>

  <Section title="Support">
    <SettingItem label="Support" icon="lifebuoy" />
    <SettingItem label="Upload debug logs to Support" icon="upload" />
    <SettingItem label="Acknowledgements" icon="information-outline" />
  </Section>

  <Section title="What's New">
    <SettingItem label="What's New" icon="new-box" />
  </Section>

  <View style={styles.logoutCard}>
    <TouchableOpacity style={styles.logoutButton} onPress={() => Alert.alert('Log out', 'Implement logout logic')}>
      <MaterialCommunityIcons name="logout" size={22} color="#ff6b6b" style={styles.logoutIcon} />
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  </View>
</ScrollView>

); }

const styles = StyleSheet.create({
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
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountType: {
    color: '#888888',
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
    alignItems: 'center',
  },
  itemIcon: {
    marginRight: 12,
  },
  itemText: {
    color: '#f8f8f2',
    fontSize: 15,
    flex: 1,
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
});