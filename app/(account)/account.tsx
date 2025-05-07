import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Avatar, Button } from 'react-native-paper';
import api from '../../lib/api';

export default function AccountScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'flex' },
      });
    };
  }, [navigation]);

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
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </>
  );

  const SettingItem = ({ label, onPress }: { label: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.itemContent}>
        <Text style={styles.itemText}>{label}</Text>
        <Text style={styles.itemArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* User Identity Card */}
      <View style={styles.identityCard}>
        <View style={styles.identityLeft}>
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

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <Text style={styles.searchPlaceholder}>Search</Text>
      </View>

      {/* FlatCard Sections */}
      <Section title="Account Settings">
      
        <SettingItem label="Account" />
        <SettingItem label="Content & Social" />
        <SettingItem label="Data & Privacy" />
        <SettingItem label="Authorized Apps" />
        <SettingItem label="Devices" />
        <SettingItem label="Connections" />
        <SettingItem label="Clips" />
        <SettingItem label="Scan QR Code" />
      </Section>

      <Section title="Security">
        <SettingItem label="Security" />
        <SettingItem label="Change Password" />
        <SettingItem label="Two-Factor Authentication" />
        <SettingItem label="Privacy" />
        <SettingItem label="Blocked Accounts" />
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
});