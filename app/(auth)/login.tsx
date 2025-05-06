import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import api from '../../lib/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        user: { email, password },
      });

      const token = response.data?.token;
      if (token) {
        await SecureStore.setItemAsync('auth_token', token);
        router.replace('/');
      } else {
        throw new Error('Token not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Invalid credentials');
    }
  };

  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GGR2App Login</Text>

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
        outlineColor="#333"
        activeOutlineColor={theme.colors.primary}
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
        outlineColor="#333"
        activeOutlineColor={theme.colors.primary}
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
      >
        Log In
      </Button>






      <Button onPress={navigateToSignup} textColor={theme.colors.primary}>
        Don't have an account? Sign up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#111',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#a78bfa',
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
});
