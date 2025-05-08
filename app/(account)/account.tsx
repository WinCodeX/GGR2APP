import { useNavigation } from '@react-navigation/native';
import { useRouter, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Avatar, Button, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import api from '../../lib/api';
import { getCachedAvatarUri } from '../../lib/avatarCache';

export default function AccountScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  // Hide the bottom tab bar
  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    };
  }, [navigation]);

  // Profile loader
  const loadProfile = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const res = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserName(res.data.username || res.data.name || 'No name');

      if (res.data.avatar_url) {
        const local = await getCachedAvatarUri(res.data.avatar_url);
        setAvatarUri(local);
      }
    } catch {
      Alert.alert('Error', 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Re-fetch on screen focus without returning a Promise
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleNavigate = (path: string) => () => {
    router.push(path);
  };

  const confirmLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setShowLogoutConfirm(false);
    Toast.show({ type: 'warningToast', text1: 'Logged out successfully' });
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#bd93f9" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.identityCard}>
        <View>
          <Text style={styles.userName}>{userName}</Text>
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

      {/* … rest of your UI … */}

      {/* Log Out */}
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

      {/* Logout Confirmation */}
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
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#1e1e2e' },
  identityCard: {
    backgroundColor: '#282a36',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  accountType: { color: '#888', fontSize: 14, marginTop: 4 },
  logoutCard: {
    backgroundColor: '#282a36',
    margin: 16,
    borderRadius: 12,
    padding: 12,
  },
  logoutButton: { flexDirection: 'row', alignItems: 'center' },
  logoutIcon: { marginRight: 12 },
  logoutText: { color: '#ff6b6b', fontSize: 16, fontWeight: '600' },
  dialog: { backgroundColor: '#282a36', borderRadius: 12 },
  dialogTitle: { color: '#f8f8f2', fontWeight: 'bold' },
  dialogText: { color: '#ccc', fontSize: 15 },
  dialogActions: { justifyContent: 'space-between', paddingHorizontal: 12 },
  dialogCancel: { backgroundColor: '#bd93f9', borderRadius: 6, marginRight: 8 },
  cancelLabel: { color: '#fff' },
  dialogConfirm: { borderColor: '#ff5555', borderWidth: 1, borderRadius: 6 },
  confirmLabel: { color: '#ff5555', fontWeight: 'bold' },
  // …other styles…
});