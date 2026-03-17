import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../../src/lib/supabase';
import { useProfile } from '../../../src/hooks/useProfile';
import { computeMacroTargets, computeCalorieTarget, GoalType } from '../../../src/lib/macroTargets';
import { useSubscription } from '../../../src/providers/SubscriptionProvider';
import { useSubmissionCount } from '../../../src/hooks/useSubmissionCount';
import { checkSubmissionCount } from '../../../src/lib/unhingedGating';
import { Button } from '../../../src/components/Button';
import { NotificationSlider } from '../../../src/components/NotificationSlider';
import { UnhingedGate } from '../../../src/components/UnhingedGate';
import { Colors, Radii, Spacing } from '../../../src/lib/theme';

const GOALS: { value: GoalType; label: string }[] = [
  { value: 'lose', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'build', label: 'Build Muscle' },
];

export default function SettingsScreen() {
  const { profile, updateNotificationLevel, updatePersonalityTier } = useProfile();
  const { isPro } = useSubscription();
  const { count: submissionCount } = useSubmissionCount();
  const [gateVisible, setGateVisible] = useState(false);
  const showUnhinged = checkSubmissionCount(submissionCount);
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState<GoalType>('maintain');
  const [calories, setCalories] = useState('');
  const [activityTarget, setActivityTarget] = useState('4');

  useEffect(() => {
    if (profile) {
      setWeight(String(profile.desired_weight_lbs));
      setGoal((profile.goal as GoalType) || 'maintain');
      setCalories(String(profile.calorie_target));
      setActivityTarget(String(profile.activity_target));
    }
  }, [profile]);

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

  async function handleSaveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        desired_weight_lbs: parseFloat(weight),
        calorie_target: parseFloat(calories),
        goal,
        activity_target: Math.min(10, Math.max(1, parseFloat(activityTarget) || 4)),
      })
      .eq('id', user.id);

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Saved', 'Profile updated.');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  const macroSplit = computeMacroTargets(parseFloat(weight) || 160, parseFloat(calories) || 2000);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <Text style={styles.sectionTitle}>Profile</Text>

        <Text style={styles.label}>Desired weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={handleWeightChange}
          keyboardType="numeric"
        />
        <Text style={styles.hint}>Protein target: {weight ? `${Math.round(parseFloat(weight))}g/day` : '—'}</Text>

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
        {weight && calories ? (
          <Text style={styles.hint}>
            Auto-split: {macroSplit.protein}g protein, {macroSplit.fat}g fat, {macroSplit.carbs}g carbs
          </Text>
        ) : null}

        <Text style={styles.label}>Daily effort target (1-10)</Text>
        <Text style={styles.hint}>4 = avg across training + rest days. 6-7 = great workout days.</Text>
        <TextInput
          style={styles.input}
          value={activityTarget}
          onChangeText={setActivityTarget}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={handleSaveProfile} variant="primary" />
        </View>

        <Text style={styles.sectionTitle}>Plan</Text>
        <Text style={styles.hint}>{isPro ? 'Pro — unlimited entries' : 'Free — 3 entries/day'}</Text>
        {!isPro && (
          <Button title="Upgrade to Pro" onPress={() => router.push('/(app)/paywall')} variant="primary" />
        )}

        <Text style={styles.sectionTitle}>Notifications</Text>

        <NotificationSlider
          level={(profile?.notification_level ?? 3) as any}
          onLevelChange={(level) => updateNotificationLevel(level)}
        />

        {!showUnhinged && (
          <Text style={styles.teaser}>More notification styles unlock as you use the app...</Text>
        )}

        {showUnhinged && (
          <View style={styles.personalityRow}>
            <Text style={styles.notifLabel}>
              Mode: {profile?.personality_tier === 'unhinged' ? '🔥 Coach AL' : '💪 Helpful Trainer'}
            </Text>
            {profile?.personality_tier !== 'unhinged' ? (
              <Button
                title="Unlock"
                variant="ghost"
                onPress={() => setGateVisible(true)}
              />
            ) : (
              <Button
                title="Switch to Helpful"
                variant="ghost"
                onPress={() => updatePersonalityTier('helpful')}
              />
            )}
          </View>
        )}

        <UnhingedGate
          visible={gateVisible}
          onClose={() => setGateVisible(false)}
          onUnlocked={() => {
            updatePersonalityTier('unhinged');
            setGateVisible(false);
          }}
        />

        <View style={styles.logoutContainer}>
          <Button title="Log out" onPress={handleLogout} variant="destructive" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.screenPadding },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  hint: { fontSize: 13, color: Colors.textMuted, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Radii.input, padding: 12, fontSize: 16 },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 8 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: Radii.input, borderWidth: 1, borderColor: Colors.inputBorder, alignItems: 'center' },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextSelected: { color: '#fff' },
  buttonContainer: { marginTop: 16 },
  notifLabel: { fontSize: 16, flex: 1 },
  teaser: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', marginTop: 4, marginBottom: 16 },
  personalityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  logoutContainer: { marginTop: 40, marginBottom: 40 },
});
