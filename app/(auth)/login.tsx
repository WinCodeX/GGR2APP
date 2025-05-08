import { useRouter } from 'expo-router'; import * as SecureStore from 'expo-secure-store'; import React, { useState } from 'react'; import { StyleSheet, Text, View } from 'react-native'; import { Button, TextInput, useTheme } from 'react-native-paper'; import Toast from 'react-native-toast-message'; import api from '../../lib/api';

export default function LoginScreen() { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [errorMsg, setErrorMsg] = useState(''); const router = useRouter(); const theme = useTheme();

const handleLogin = async () => { setErrorMsg(''); try { const response = await api.post('/login', { email, password, });

const token = response?.data?.token;
  if (token) {
    await SecureStore.setItemAsync('auth_token', token);
    Toast.show({
      type: 'defaultToast',
      text1: 'Welcome back!',
    });
    router.replace('/');
  } else {
    setErrorMsg('Login failed: token missing');
  }
} catch (error: any) {
  console.error('Login error:', error?.response?.data || error.message);
  setErrorMsg('Invalid email or password');
}

};

const navigateToSignup = () => { router.push('/signup'); };

return ( <View style={styles.container}> <Text style={styles.title}>GGR2App Login</Text>

<TextInput
    label="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
    mode="outlined"
    style={styles.input}
    textColor="#f8f8f2"
    placeholderTextColor="#ccc"
    outlineColor="#44475a"
    activeOutlineColor="#bd93f9"
  />

  <TextInput
    label="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    mode="outlined"
    style={styles.input}
    textColor="#f8f8f2"
    placeholderTextColor="#ccc"
    outlineColor="#44475a"
    activeOutlineColor="#bd93f9"
    right={
      <TextInput.Icon
        icon={showPassword ? 'eye-off' : 'eye'}
        onPress={() => setShowPassword((prev) => !prev)}
        forceTextInputFocus={false}
        size={22}
        color="#aaa"
      />
    }
  />

  {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

  <Button
    mode="contained"
    onPress={handleLogin}
    style={styles.button}
    labelStyle={{ fontWeight: 'bold', color: '#fff' }}
  >
    Log In
  </Button>

  <Button
    onPress={navigateToSignup}
    textColor="#bd93f9"
    style={{ marginTop: 12 }}
  >
    Don't have an account? Sign up
  </Button>
</View>

); }

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#282a36', padding: 24, justifyContent: 'center', }, title: { color: '#f8f8f2', fontSize: 24, fontWeight: '600', marginBottom: 20, textAlign: 'center', }, input: { marginBottom: 16, backgroundColor: '#1e1e2f', borderRadius: 8, }, button: { backgroundColor: '#bd93f9', marginTop: 8, paddingVertical: 10, borderRadius: 10, }, error: { color: '#ff5555', textAlign: 'center', marginBottom: 8, fontSize: 14, }, });

