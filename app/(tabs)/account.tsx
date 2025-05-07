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
import { Avatar, List, useTheme, Button, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function AccountScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const res = await api.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name || 'Unknown User');
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

  const renderSectionTitle = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Top Profile */}
      <View style={styles.profileTop}>
        <TouchableOpacity onPress={handleNavigate('/avatar')}>
          <Avatar.Image
            size={80}
            source={
              avatarUri
                ? { uri: avatarUri }
                : require('../../assets/images/avatar-placeholder.png')
            }
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.level}>LVL0</Text>
          {loading ? (
            <ActivityIndicator color="#f8f8f2" size="small" />
          ) : (
            <Text style={styles.username}>{userName}</Text>
          )}
        </View>
        <Button
          mode="contained"
          onPress={handleNavigate('/profile')}
          style={styles.editButton}
          labelStyle={{ color: '#fff' }}
        >
          Edit Profile
        </Button>
      </View>

      {/* Premium */}
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

      {/* GROUP: Account Settings */}
      {renderSectionTitle('Account Settings')}
      <List.Section>
        <List.Item title="Account" left={() => <List.Icon icon="account" />} onPress={handleNavigate('/settings/account')} />
        <List.Item title="Content & Social" left={() => <List.Icon icon="account-multiple" />} />
        <List.Item title="Data & Privacy" left={() => <List.Icon icon="shield-lock-outline" />} />
        <List.Item title="Family Center" left={() => <List.Icon icon="account-group-outline" />} />
        <List.Item title="Authorized Apps" left={() => <List.Icon icon="lock-outline" />} />
        <List.Item title="Devices" left={() => <List.Icon icon="cellphone" />} />
        <List.Item title="Connections" left={() => <List.Icon icon="link-variant" />} />
        <List.Item title="Scan QR Code" left={() => <List.Icon icon="qrcode-scan" />} />
      </List.Section>

      {/* GROUP: Billing */}
      {renderSectionTitle('Billing Settings')}
      <List.Section>
        <List.Item title="Quests" left={() => <List.Icon icon="target" />} />
        <List.Item title="Server Boost" left={() => <List.Icon icon="rocket-launch-outline" />} />
        <List.Item title="Gifting" left={() => <List.Icon icon="gift-outline" />} />
      </List.Section>

      {/* GROUP: App Settings */}
      {renderSectionTitle('App Settings')}
      <List.Section>
        <List.Item title="Voice" left={() => <List.Icon icon="microphone-outline" />} />
        <List.Item title="Appearance" left={() => <List.Icon icon="palette" />} />
        <List.Item title="Accessibility" left={() => <List.Icon icon="eye-outline" />} />
        <List.Item title="Language" description="English" left={() => <List.Icon icon="translate" />} />
        <List.Item title="Notifications" left={() => <List.Icon icon="bell-outline" />} />
        <List.Item title="App Icon" left={() => <List.Icon icon="apps" />} />
        <List.Item title="Advanced" left={() => <List.Icon icon="cog-outline" />} />
      </List.Section>

      {/* GROUP: Support */}
      {renderSectionTitle('Support')}
      <List.Section>
        <List.Item title="Support Center" left={() => <List.Icon icon="help-circle-outline" />} />
        <List.Item title="Debug Logs" left={() => <List.Icon icon="bug-outline" />} />
        <List.Item title="Acknowledgements" left={() => <List.Icon icon="information-outline" />} />
      </List.Section>

      {/* Log Out */}
      <Divider style={{ marginVertical: 8 }} />
      <List.Item
        title="Log Out"
        titleStyle={{ color: '#ff5555', fontWeight: 'bold' }}
        left={() => <List.Icon icon="logout" color="#ff5555" />}
        onPress={() => Alert.alert('Log out?', 'Implement log out logic')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2e',
  },
  profileTop: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#282a36',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  level: {
    color: '#bd93f9',
    fontWeight: 'bold',
    fontSize: 18,
  },
  username: {
    color: '#f8f8f2',
    fontSize: 16,
    marginTop: 4,
  },
  editButton: {
    marginTop: 16,
    backgroundColor: '#44475a',
    borderRadius: 20,
    paddingHorizontal: 24,
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
  sectionTitle: {
    color: '#f1f1f1',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 4,
  },
});