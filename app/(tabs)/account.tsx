import React, { useState, useEffect } from 'react'; import { View, StyleSheet, Text, Image, TouchableOpacity, Alert, } from 'react-native'; import * as SecureStore from 'expo-secure-store'; import * as ImagePicker from 'expo-image-picker'; import { TextInput, Button, useTheme } from 'react-native-paper'; import { useRouter } from 'expo-router'; import api from '../../lib/api'; import Images from '../../assets';

export default function AccountScreen() { const [user, setUser] = useState<{ name: string; avatar: string | null }>({ name: '', avatar: null, }); const [editingName, setEditingName] = useState(false); const [newName, setNewName] = useState(''); const [updating, setUpdating] = useState(false); const router = useRouter(); const theme = useTheme();

useEffect(() => { const fetchUser = async () => { try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.get('/me', { headers: { Authorization: Bearer ${token} }, }); setUser(res.data); setNewName(res.data.name); } catch (error: any) { console.error('Fetch user error:', error); Alert.alert('Error', 'Unable to load profile.'); } }; fetchUser(); }, []);

const handleUpdateName = async () => { setUpdating(true); try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.put( '/me', { name: newName }, { headers: { Authorization: Bearer ${token} } } ); setUser((prev) => ({ ...prev, name: res.data.name })); setEditingName(false); } catch (error: any) { console.error('Update name error:', error); Alert.alert('Error', 'Unable to update name.'); } setUpdating(false); };

const pickImageAndUpload = async () => { const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); if (status !== 'granted') { Alert.alert('Permission required', 'Permission to access gallery is required!'); return; } const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, });

if (!result.canceled) {
  const uri = result.assets[0].uri;
  const filename = uri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image';

  const formData = new FormData();
  formData.append('avatar', { uri, name: filename, type } as any);

  try {
    const token = await SecureStore.getItemAsync('auth_token');
    const response = await fetch(`${api.defaults.baseURL}/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: formData,
    });
    const data = await response.json();
    if (data.avatar_url) {
      setUser((prev) => ({ ...prev, avatar: data.avatar_url }));
    } else {
      throw new Error('No avatar_url returned');
    }
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    Alert.alert('Error', 'Unable to upload avatar.');
  }
}

};

const handleLogout = async () => { await SecureStore.deleteItemAsync('auth_token'); router.replace('/login'); };

return ( <View style={styles.container}> {/* Avatar */} <TouchableOpacity onPress={pickImageAndUpload} disabled={updating}> <Image source={ user.avatar ? { uri: user.avatar } : Images.avatarPlaceholder } style={styles.avatar} /> </TouchableOpacity>

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
          },
        }}
        outlineColor="#44475a"
        activeOutlineColor="#bd93f9"
      />
      <Button
        mode="contained"
        onPress={handleUpdateName}
        loading={updating}
        style={styles.saveButton}
        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
      >
        Save
      </Button>
    </>
  )}

  {/* Business CTA */}
  <TouchableOpacity
    style={styles.businessButton}
    onPress={() => router.push('/business/create')}
  >
    <Text style={styles.businessText}>CREATE BUSINESS PROFILE</Text>
  </TouchableOpacity>

  {/* Actions */}
  <View style={styles.section}>
    <AccountRow title="Edit Profile" onPress={() => router.push('/edit-profile')} />
    <AccountRow title="Payment" onPress={() => router.push('/payment')} />
    <AccountRow title="Subscription" onPress={() => router.push('/subscription')} />
    <AccountRow title="Log Out" logout onPress={handleLogout} />
  </View>
</View>

); }

function AccountRow({ title, logout = false, onPress = () => {} }: { title: string; logout?: boolean; onPress?: () => void }) { return ( <TouchableOpacity style={styles.row} onPress={onPress}> <Text style={[styles.rowText, logout && { color: '#ff5555' }]}>{title}</Text> </TouchableOpacity> ); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#1a1b26', alignItems: 'center', paddingTop: 48, }, avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#bd93f9', marginBottom: 12, }, name: { fontSize: 22, fontWeight: 'bold', color: '#f8f8f2', }, subtitle: { color: '#6272a4', marginBottom: 16, }, edit: { color: '#bd93f9', marginBottom: 24, }, input: { width: '80%', marginBottom: 16, backgroundColor: '#1e1e2f', borderRadius: 8, }, saveButton: { backgroundColor: '#bd93f9', width: '60%', marginBottom: 20, borderRadius: 10, }, businessButton: { backgroundColor: '#282a36', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 12, marginBottom: 24, }, businessText: { color: '#bd93f9', fontWeight: 'bold', fontSize: 13, letterSpacing: 1, }, section: { width: '90%', }, row: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#44475a', }, rowText: { color: '#f8f8f2', fontSize: 16, }, });

