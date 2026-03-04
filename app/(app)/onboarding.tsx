import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { computeMacroTargets } from '../../src/lib/macroTargets';

export default function OnboardingScreen() {
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('2000');
  const [activityTarget, setActivityTarget] = useState('4');

  async function handleSave() {
    const weightNum = parseFloat(weight);
    const calorieNum = parseFloat(calories);
    if (!weightNum || weightNum < 50 || weightNum > 500) {
      Alert.alert('Error', 'Enter a valid weight between 50-500 lbs');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        desired_weight_lbs: weightNum,
        calorie_target: calorieNum,
        activity_target: Math.min(10, Math.max(1, parseFloat(activityTarget) || 4)),
      })
      .eq('id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    router.replace('/(app)/(tabs)');
  }

  const proteinTarget = weight ? `${Math.round(parseFloat(weight))}g protein/day` : '';
  const macroSplit = weight && calories
    ? computeMacroTargets(parseFloat(weight) || 160, parseFloat(calories) || 2000)
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's set your targets</Text>
      <Text style={styles.subtitle}>We'll keep it simple. Just two numbers.</Text>

      <Text style={styles.label}>Desired weight (lbs)</Text>
      <Text style={styles.hint}>Your protein target will be 1g per pound</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 180"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      {proteinTarget ? <Text style={styles.proteinHint}>→ {proteinTarget}</Text> : null}

      <Text style={styles.label}>Daily calorie target</Text>
      <Text style={styles.hint}>A reasonable starting point for most people is 2000</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 2000"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      {macroSplit ? (
        <Text style={styles.hint}>
          Auto-split: {macroSplit.protein}g protein, {macroSplit.fat}g fat, {macroSplit.carbs}g carbs
        </Text>
      ) : null}

      <Text style={styles.label}>Daily effort target (1-10)</Text>
      <Text style={styles.hint}>4 = avg across training + rest days. 6-7 = great workout days.</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 4"
        value={activityTarget}
        onChangeText={setActivityTarget}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 2 },
  hint: { fontSize: 13, color: '#999', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 18, marginBottom: 4 },
  proteinHint: { fontSize: 14, color: '#34C759', fontWeight: '600', marginBottom: 8 },
  button: { backgroundColor: '#000', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
