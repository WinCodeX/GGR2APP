import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Avatar, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function AccountScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const res = await api.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name || null);
        setAvatarUri(res.data.avatar_url);
      } catch {
        Alert.alert('Error', 'Unable to load profile.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNavigate = (path: string) => () => {
    router.push(path);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User Header */}
      <View style={styles.userCard}>
        <View style={styles.userInfoLeft}>
          <Text style={styles.userName}>{userName || 'No name'}</Text>
          <Text style={styles.accountType}>Client account</Text>
        </View>
        <TouchableOpacity onPress={handleNavigate('/avatar')}>
          <Avatar.Image
            size={60}
            source={
              avatarUri
                ? { uri: avatarUri }
                : require('../../assets/images/avatar-placeholder.png')
            }
          />
        </TouchableOpacity>
      </View>

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

      {/* FlatCard Sections */}
      <Section title="Account Settings">
        <SettingItem label="Get Nitro" />
        <SettingItem label="Account" />
        <SettingItem label="Content & Social" />
        <SettingItem label="Data & Privacy" />
        <SettingItem label="Family Center" />
        <SettingItem label="Authorized Apps" />
        <SettingItem label="Devices" />
        <SettingItem label="Connections" />
        <SettingItem label="Clips" />
        <SettingItem label="Scan QR Code" />
      </Section>

      <Section title="Billing Settings">
        <SettingItem label="Quests" />
        <SettingItem label="Server Boost" />
        <SettingItem label="Nitro Gifting" />
      </Section>

      <Section title="App Settings">
        <SettingItem label="Voice" />
        <SettingItem label="Appearance" />
        <SettingItem label="Accessibility" />
        <SettingItem label="Language" />
        <SettingItem label="Chat" />
        <SettingItem label="Web Browser" />
        <SettingItem label="Notifications" />
        <SettingItem label="App Icon" />
        <SettingItem label="Advanced" />
      </Section>

      <Section title="Support">
        <SettingItem label="Support" />
        <SettingItem label="Upload debug logs to Support" />
        <SettingItem label="Acknowledgements" />
      </Section>

      <Section title="What's New">
        <SettingItem label="What's New" />
      </Section>

      <Section title="">
        <SettingItem label="Log Out" onPress={() => Alert.alert('Log out', 'Implement logout logic')} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#282a36',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#44475a',
  },
  userInfoLeft: {
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
  sectionCard: {
    backgroundColor: '#282a36',
    margin: 12,
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    color: '#f8f8f2',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomColor: '#44475a',
    borderBottomWidth: 1,
  },
  itemText: {
    color: '#f8f8f2',
    fontSize: 15,
  },
});