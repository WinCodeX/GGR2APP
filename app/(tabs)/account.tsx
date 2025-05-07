import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Avatar, List, useTheme, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function AccountScreen() {
  const [userName, setUserName] = useState('~lvlØ~');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const res = await api.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
        setAvatarUri(res.data.avatar_url);
      } catch {
        Alert.alert('Error', 'Unable to load profile.');
      }
    })();
  }, []);

  const handleNavigate = (path: string) => () => {
    router.push(path);
  };

  return (
    <ScrollView style={styles.container}>
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
          <Text style={styles.username}>{userName}</Text>
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

      <List.Section>
        <List.Item
          title="Orders"
          description="View past & current deliveries"
          left={(props) => <List.Icon {...props} icon="package-variant" />}
          onPress={handleNavigate('/orders')}
        />
        <List.Item
          title="Notifications"
          description="Manage push and app alerts"
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          onPress={handleNavigate('/notifications')}
        />
        <List.Item
          title="Storage & Data"
          description="Usage stats, cache control"
          left={(props) => <List.Icon {...props} icon="database-outline" />}
          onPress={handleNavigate('/storage')}
        />
        <List.Item
          title="Language"
          description="App language preferences"
          left={(props) => <List.Icon {...props} icon="translate" />}
          onPress={handleNavigate('/language')}
        />
        <List.Item
          title="Help & Support"
          description="Contact support, policies"
          left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
          onPress={handleNavigate('/help')}
        />
      </List.Section>
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
});