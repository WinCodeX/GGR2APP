import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function AccountScreen() {
  const [userName, setUserName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        const res = await api.get('/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(res.data.name);
        setNewName(res.data.name);
      } catch (error: any) {
        console.error('Fetch user error:', error);
        Alert.alert('Error', 'Unable to load profile.');
      }
    };
    fetchUser();
  }, []);

  const handleUpdateName = async () => {
    setUpdating(true);
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const res = await api.put(
        '/me',
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserName(res.data.name);
      setEditingName(false);
    } catch (error: any) {
      console.error('Update name error:', error);
      Alert.alert('Error', 'Unable to update name.');
    }
    setUpdating(false);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account</Text>

      {!editingName ? (
        <>
          <Text style={styles.name}>{userName}</Text>
          <Button onPress={() => setEditingName(true)} textColor={theme.colors.primary}>
            Edit Name
          </Button>
        </>
      ) : (
        <>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            mode="outlined"
            style={styles.input}
            outlineColor="#44475a"
            activeOutlineColor="#bd93f9"
          />
          <Button
            mode="contained"
            onPress={handleUpdateName}
            loading={updating}
            style={styles.saveButton}
          >
            Save
          </Button>
        </>
      )}

      <Button mode="outlined" onPress={handleLogout} style={styles.logoutButton}>
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b26',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bd93f9',
    marginBottom: 24,
  },
  name: {
    fontSize: 20,
    color: '#f8f8f2',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e2f',
    borderRadius: 8,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#bd93f9',
    borderRadius: 10,
    marginBottom: 24,
  },
  logoutButton: {
    marginTop: 32,
    borderColor: '#ff5555',
  },
});