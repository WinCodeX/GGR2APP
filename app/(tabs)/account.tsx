import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { List, Avatar, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function AccountScreen() {
  const [userName, setUserName] = useState('Your Name');
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
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleNavigate('/avatar')}>
          <Avatar.Image
            size={80}
            source={
              avatarUri
                ? { uri: avatarUri }
                : require('../../assets/avatar-placeholder.png')
            }
          />
        </TouchableOpacity>
        <List.Section style={styles.nameSection}>
          <List.Item
            title={userName}
            description="Tap to view profile"
            onPress={handleNavigate('/profile')}
            titleStyle={styles.profileName}
            descriptionStyle={styles.profileSubtitle}
          />
        </List.Section>
      </View>

      <View style={styles.divider} />

      <List.Section>
        <List.Item
          title="Account"
          description="Security notifications, change number"
          left={(props) => <List.Icon {...props} icon="key-outline" />}
          onPress={handleNavigate('/settings/account')}
        />
        <List.Item
          title="Privacy"
          description="Block contacts, disappearing messages"
          left={(props) => <List.Icon {...props} icon="shield-outline" />}
          onPress={handleNavigate('/settings/privacy')}
        />
        <List.Item
          title="Avatar"
          description="Create, edit, profile photo"
          left={(props) => <List.Icon {...props} icon="face-profile" />}
          onPress={handleNavigate('/settings/avatar')}
        />
        <List.Item
          title="Lists"
          description="Manage people and groups"
          left={(props) => <List.Icon {...props} icon="playlist-edit" />}
          onPress={handleNavigate('/settings/lists')}
        />
        <List.Item
          title="Chats"
          description="Theme, wallpapers, chat history"
          left={(props) => <List.Icon {...props} icon="chat-outline" />}
          onPress={handleNavigate('/settings/chats')}
        />
        <List.Item
          title="Notifications"
          description="Message, group & call tones"
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          onPress={handleNavigate('/settings/notifications')}
        />
        <List.Item
          title="Storage and data"
          description="Network usage, auto-download"
          left={(props) => <List.Icon {...props} icon="database-outline" />}
          onPress={handleNavigate('/settings/storage')}
        />
        <List.Item
          title="App language"
          description="English (device’s language)"
          left={(props) => <List.Icon {...props} icon="translate" />}
          onPress={handleNavigate('/settings/language')}
        />
        <List.Item
          title="Help"
          description="Help center, contact us, privacy policy"
          left={(props) => <List.Icon {...props} icon="help-circle-outline" />}
          onPress={handleNavigate('/settings/help')}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1f1f1f',
  },
  nameSection: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  profileSubtitle: {
    color: '#aaa',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
  },
});