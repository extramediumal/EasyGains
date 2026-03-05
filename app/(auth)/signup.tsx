import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { Button } from '../../src/components/Button';
import { Colors, Radii, Spacing } from '../../src/lib/theme';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id });
    }
    router.replace('/(app)/onboarding');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join EasyGains</Text>
      <Text style={styles.subtitle}>Track protein. Build muscle. Keep it simple.</Text>

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
          title={loading ? 'Creating account...' : 'Sign Up'}
          onPress={handleSignup}
          disabled={loading}
          variant="primary"
        />
      </View>

      <Button
        title="Already have an account? Log in"
        onPress={() => router.back()}
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
