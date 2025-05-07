import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import api from '../../lib/api';

export default function AccountScreen() {
  const [user, setUser] = useState({ name: '', avatar: null });
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      const res = await api.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setNewName(res.data.name);
    };
    fetchUser();
  }, []);

  const handleUpdateName = async () => {
    setUpdating(true);
    const token = await SecureStore.getItemAsync('auth_token');
    await api.put('/me', { name: newName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(prev => ({ ...prev, name: newName }));
    setEditingName(false);
    setUpdating(false);
  };

  const pickImageAndUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append('avatar', {
        uri,
        name: filename,
        type,
      });

      const token = await SecureStore.getItemAsync('auth_token');
      const response = await fetch(`${api.defaults.baseURL}/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      if (data.avatar_url) {
        setUser(prev => ({ ...prev, avatar: data.avatar_url }));
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <TouchableOpacity onPress={pickImageAndUpload}>
        <Image
          source={user.avatar ? { uri: user.avatar } : require('../../assets/avatar-placeholder.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* Name & Edit */}
      {!editingName ? (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.subtitle}>Delivering made easy.</Text>
          <TouchableOpacity onPress={() => setEditingName(true)}>
            <Text style={styles.edit}>Edit Name</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                text: '#f8f8f2',
                background: '#282a36',
                placeholder: '#6272a4',
                primary: '#bd93f9',
              }
            }}
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

      {/* CTA */}
      <TouchableOpacity style={styles.businessButton}>
        <Text style={styles.businessText}>CREATE BUSINESS PROFILE</Text>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.section}>
        <AccountRow title="Edit Profile" onPress={() => router.push('/edit-profile')} />
        <AccountRow title="Payment" />
        <AccountRow title="Subscription" />
        <AccountRow title="Log Out" logout />
      </View>
    </View>
  );
}

function AccountRow({ title, logout = false, onPress = () => {} }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={[styles.rowText, logout && { color: '#ff5555' }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b26',
    alignItems: 'center',
    paddingTop: 48,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#bd93f9',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f8f8f2',
  },
  subtitle: {
    color: '#6272a4',
    marginBottom: 16,
  },
  edit: {
    color: '#bd93f9',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#bd93f9',
    width: '60%',
    marginBottom: 20,
  },
  businessButton: {
    backgroundColor: '#282a36',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 24,
  },
  businessText: {
    color: '#bd93f9',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  section: {
    width: '90%',
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#44475a',
  },
  rowText: {
    color: '#f8f8f2',
    fontSize: 16,
  },
});