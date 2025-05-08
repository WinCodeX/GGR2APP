import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import api from '../../lib/api'; // Adjust path if needed

export default function SignupScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      await api.post('/signup', {
        email,
        password,
        password_confirmation: confirmPassword,
      });

      Toast.show({
        type: 'successToast',
        text1: 'Account created successfully',
      });
      router.replace('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg('Signup failed. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
        textColor="#f8f8f2"
        placeholderTextColor="#888"
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
        placeholderTextColor="#888"
        outlineColor="#44475a"
        activeOutlineColor="#bd93f9"
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword((v) => !v)}
            forceTextInputFocus={false}
            color="#aaa"
          />
        }
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirm}
        mode="outlined"
        style={styles.input}
        textColor="#f8f8f2"
        placeholderTextColor="#888"
        outlineColor="#44475a"
        activeOutlineColor="#bd93f9"
        right={
          <TextInput.Icon
            icon={showConfirm ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirm((v) => !v)}
            forceTextInputFocus={false}
            color="#aaa"
          />
        }
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSignup}
        style={styles.button}
        labelStyle={{ color: '#f8f8f2', fontWeight: 'bold' }}
      >
        Sign Up
      </Button>

      <Button
        onPress={() => router.push('/login')}
        textColor="#bd93f9"
        style={styles.link}
      >
        Already have an account? Log in
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282a36',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#f8f8f2',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e1e2f',
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#bd93f9',
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  link: {
    marginTop: 12,
  },
  error: {
    color: '#ff5555',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
  },
});