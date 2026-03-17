import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuth } from '../../src/providers/AuthProvider';
import { Button } from '../../src/components/Button';
import { Colors, Radii, Spacing } from '../../src/lib/theme';

export default function ResetPasswordScreen() {
  const { clearPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (password.length < 8) {
      Alert.alert('Too short', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      clearPasswordRecovery();
      router.replace('/(app)');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set new password</Text>
      <Text style={styles.subtitle}>Choose something you'll remember.</Text>

      <TextInput
        style={styles.input}
        placeholder="New password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoFocus
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Saving...' : 'Set Password'}
          onPress={handleReset}
          disabled={loading}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 32 },
  input: { borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Radii.input, padding: 14, fontSize: 16, marginBottom: 12 },
  buttonContainer: { marginTop: 8 },
});
