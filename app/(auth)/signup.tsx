import { useRouter } from 'expo-router'; import React, { useState } from 'react'; import { StyleSheet, Text, View } from 'react-native'; import { Button, TextInput } from 'react-native-paper'; import Toast from 'react-native-toast-message'; import api from '../../lib/api'; // Adjust path if needed

export default function SignupScreen() { const [email, setEmail] = useState<string>(''); const [password, setPassword] = useState<string>(''); const [confirmPassword, setConfirmPassword] = useState<string>(''); const [showPassword, setShowPassword] = useState<boolean>(false); const [showConfirm, setShowConfirm] = useState<boolean>(false); const [errorMsg, setErrorMsg] = useState<string>('');

const router = useRouter();

const handleSignup = async () => { if (password !== confirmPassword) { setErrorMsg('Passwords do not match'); return; }

try {
  await api.post('/signup', {
    user: {
      email,
      password,
      password_confirmation: confirmPassword,
    },
  });

  Toast.show({
    type: 'successToast',
    text1: 'Account created successfully',
  });
  router.replace('/login');
} catch (error) {
  console.error('❌ Signup error:', error);
  setErrorMsg('Signup failed. Try again.');
}

};

const navigateToLogin = () => { router.push('/login'); };

return ( <View style={styles.container}> <Text style={styles.title}>Create Account</Text>

<TextInput
    label="Email"
    style={styles.input}
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
    theme={{
      colors: {
        text: '#aaa',
        placeholder: '#aaa',
        background: '#111',
        primary: '#a78bfa',
      },
    }}
  />

  <TextInput
    label="Password"
    style={styles.input}
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    right={
      <TextInput.Icon
        icon={showPassword ? 'eye-off' : 'eye'}
        onPress={() => setShowPassword(prev => !prev)}
        color="#aaa"
      />
    }
    theme={{
      colors: {
        text: '#aaa',
        placeholder: '#aaa',
        background: '#111',
        primary: '#a78bfa',
      },
    }}
  />

  <TextInput
    label="Confirm Password"
    style={styles.input}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
    secureTextEntry={!showConfirm}
    right={
      <TextInput.Icon
        icon={showConfirm ? 'eye-off' : 'eye'}
        onPress={() => setShowConfirm(prev => !prev)}
        color="#aaa"
      />
    }
    theme={{
      colors: {
        text: '#aaa',
        placeholder: '#aaa',
        background: '#111',
        primary: '#a78bfa',
      },
    }}
  />

  {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

  <Button
    mode="contained"
    onPress={handleSignup}
    style={styles.button}
  >
    Sign Up
  </Button>

  <Button
    onPress={navigateToLogin}
    textColor="#1d9bf0"
  >
    Already have an account? Log in
  </Button>
</View>

); }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#111',
    marginBottom: 16,
    color: '#aaa',
  },
  button: {
    backgroundColor: '#a78bfa',
    marginTop: 8,
    padding: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
});