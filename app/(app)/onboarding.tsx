import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { computeMacroTargets, computeCalorieTarget, GoalType } from '../../src/lib/macroTargets';
import { Button } from '../../src/components/Button';
import { Colors, Radii, Spacing } from '../../src/lib/theme';
import { useGuideState } from '../../src/hooks/useGuideState';
import { GuidePopup } from '../../src/components/GuidePopup';
import { GUIDE_STEPS } from '../../src/lib/guideSteps';

const GOALS: { value: GoalType; label: string }[] = [
  { value: 'lose', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'build', label: 'Build Muscle' },
];

export default function OnboardingScreen() {
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<GoalType>('maintain');
  const [calories, setCalories] = useState('2000');
  const [activityTarget, setActivityTarget] = useState('4');
  const { currentStep, isGuideComplete, advanceStep } = useGuideState();
  const [showGuide, setShowGuide] = useState(false);

  function handleGoalSelect(selected: GoalType) {
    setGoal(selected);
    const weightNum = parseFloat(weight);
    if (weightNum > 0) {
      setCalories(String(computeCalorieTarget(weightNum, selected)));
    }
  }

  function handleWeightChange(val: string) {
    setWeight(val);
    const weightNum = parseFloat(val);
    if (weightNum > 0) {
      setCalories(String(computeCalorieTarget(weightNum, goal)));
    }
  }

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
        goal,
        activity_target: Math.min(10, Math.max(1, parseFloat(activityTarget) || 4)),
      })
      .eq('id', user.id);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setShowGuide(true);
  }

  async function handleGuideDismiss() {
    await advanceStep();
    if (currentStep >= 1) {
      router.replace('/(app)/(tabs)');
    }
  }

  const proteinTarget = weight ? `${Math.round(parseFloat(weight))}g protein/day` : '';
  const macroSplit = weight && calories
    ? computeMacroTargets(parseFloat(weight) || 160, parseFloat(calories) || 2000)
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's set your targets</Text>
      <Text style={styles.subtitle}>We'll keep it simple.</Text>

      <Text style={styles.label}>Desired weight (lbs)</Text>
      <Text style={styles.hint}>Your goal weight. We use this to set your targets.</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 180"
        value={weight}
        onChangeText={handleWeightChange}
        keyboardType="numeric"
      />
      {proteinTarget ? <Text style={styles.proteinHint}>{proteinTarget}</Text> : null}

      <Text style={styles.label}>Goal</Text>
      <View style={styles.chipRow}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[styles.chip, goal === g.value && styles.chipSelected]}
            onPress={() => handleGoalSelect(g.value)}
          >
            <Text style={[styles.chipText, goal === g.value && styles.chipTextSelected]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Daily calorie target</Text>
      <Text style={styles.hint}>Auto-calculated from your goal. Edit if needed.</Text>
      <TextInput
        style={styles.input}
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
      <Text style={styles.hint}>How hard you want to push this week, on a 1-10 scale. 4 = moderate, 7 = intense.</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 4"
        value={activityTarget}
        onChangeText={setActivityTarget}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button title="Let's Go" onPress={handleSave} variant="primary" />
      </View>

      {showGuide && !isGuideComplete && currentStep <= 1 && (
        <GuidePopup
          visible={true}
          message={GUIDE_STEPS[currentStep]?.message || ''}
          buttonText={GUIDE_STEPS[currentStep]?.buttonText || 'Next'}
          onDismiss={handleGuideDismiss}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: Spacing.screenPadding, backgroundColor: Colors.background },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginBottom: 32 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 2 },
  hint: { fontSize: 13, color: Colors.textMuted, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Radii.input, padding: 14, fontSize: 18, marginBottom: 4 },
  proteinHint: { fontSize: 14, color: Colors.success, fontWeight: '600', marginBottom: 8 },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 8 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: Radii.input, borderWidth: 1, borderColor: Colors.inputBorder, alignItems: 'center' },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  chipTextSelected: { color: '#fff' },
  buttonContainer: { marginTop: 24 },
});
