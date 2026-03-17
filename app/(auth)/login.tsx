import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { Button } from '../../src/components/Button';
import { Colors, Radii, Spacing } from '../../src/lib/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert('Enter your email', 'Type your email above, then tap Forgot Password.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'easygains://reset-password',
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Check your email', `We sent a password reset link to ${email}.`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EasyGains</Text>
      <Text style={styles.subtitle}>Just say what you ate.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Loading...' : 'Log In'}
          onPress={handleLogin}
          disabled={loading}
          variant="primary"
        />
      </View>

      <Button
        title="Forgot password?"
        onPress={handleForgotPassword}
        variant="ghost"
      />
      <Button
        title="Don't have an account? Sign up"
        onPress={() => router.push('/(auth)/signup')}
        variant="ghost"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding, backgroundColor: Colors.background },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Radii.input, padding: 14, fontSize: 16, marginBottom: 12 },
  buttonContainer: { marginTop: 8 },
});
