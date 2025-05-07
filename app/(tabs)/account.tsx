import React, { useState, useEffect } from 'react'; import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native'; import * as SecureStore from 'expo-secure-store'; import { TextInput, Button, useTheme } from 'react-native-paper'; import { useRouter } from 'expo-router'; import api from '../../lib/api';

export default function AccountScreen() { const [userName, setUserName] = useState(''); const [editingName, setEditingName] = useState(false); const [newName, setNewName] = useState(''); const [updating, setUpdating] = useState(false); const router = useRouter(); const theme = useTheme();

useEffect(() => { const fetchUser = async () => { try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.get('/me', { headers: { Authorization: Bearer ${token} }, }); setUserName(res.data.name); setNewName(res.data.name); } catch (error: any) { console.error('Fetch user error:', error); Alert.alert('Error', 'Unable to load profile.'); } }; fetchUser(); }, []);

const handleUpdateName = async () => { setUpdating(true); try { const token = await SecureStore.getItemAsync('auth_token'); const res = await api.put( '/me', { name: newName }, { headers: { Authorization: Bearer ${token} } } ); setUserName(res.data.name); setEditingName(false); } catch (error: any) { console.error('Update name error:', error); Alert.alert('Error', 'Unable to update name.'); } setUpdating(false); };

const handleLogout = async () => { await SecureStore.deleteItemAsync('auth_token'); router.replace('/login'); };

return ( <View style={styles.container}> <Text style={styles.header}>Account</Text>

{!editingName ? (
    <>
      <Text style={styles.name}>{userName}</Text>
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

  <View style={styles.actions}>
    <Button
      mode="outlined"
      onPress={() => router.push('/edit-profile')}
      style={styles.actionButton}
      labelStyle={{ color: theme.colors.primary }}
    >
      Edit Profile Details
    </Button>
    <Button
      mode="contained"
      onPress={handleLogout}
      style={styles.logoutButton}
      labelStyle={{ color: '#fff' }}
    >
      Log Out
    </Button>
  </View>
</View>

); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#1a1b26', alignItems: 'center', paddingTop: 48, paddingHorizontal: 24, }, header: { fontSize: 24, fontWeight: 'bold', color: '#bd93f9', marginBottom: 24, }, name: { fontSize: 20, color: '#f8f8f2', marginBottom: 12, }, edit: { color: '#6272a4', marginBottom: 24, }, input: { width: '100%', backgroundColor: '#1e1e2f', borderRadius: 8, marginBottom: 16, }, saveButton: { backgroundColor: '#bd93f9', width: '60%', borderRadius: 10, marginBottom: 24, }, actions: { marginTop: 32, width: '100%', }, actionButton: { marginBottom: 12, borderColor: '#bd93f9', }, logoutButton: { backgroundColor: '#ff5555', }, });

