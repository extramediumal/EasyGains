import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../../src/lib/supabase';
import { useProfile } from '../../../src/hooks/useProfile';
import { useNotificationSettings } from '../../../src/hooks/useNotificationSettings';

const MEAL_DEFAULTS = [
  { type: 'breakfast', label: 'Breakfast', defaultTime: '08:00' },
  { type: 'lunch', label: 'Lunch', defaultTime: '12:30' },
  { type: 'dinner', label: 'Dinner', defaultTime: '18:30' },
  { type: 'snack', label: 'Snack', defaultTime: '15:00' },
];

export default function SettingsScreen() {
  const { profile } = useProfile();
  const { settings, updateSetting } = useNotificationSettings();
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [activityTarget, setActivityTarget] = useState('5');

  useEffect(() => {
    if (profile) {
      setWeight(String(profile.desired_weight_lbs));
      setCalories(String(profile.calorie_target));
      setActivityTarget(String(profile.activity_target));
    }
  }, [profile]);

  async function handleSaveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        desired_weight_lbs: parseFloat(weight),
        calorie_target: parseFloat(calories),
        activity_target: parseFloat(activityTarget) || 5,
      })
      .eq('id', user.id);

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Saved', 'Profile updated.');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  function getSettingForMeal(mealType: string) {
    return settings.find((s) => s.meal_type === mealType);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {/* Profile Section */}
        <Text style={styles.sectionTitle}>Profile</Text>

        <Text style={styles.label}>Desired weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Text style={styles.hint}>Protein target: {weight ? `${Math.round(parseFloat(weight))}g/day` : '—'}</Text>

        <Text style={styles.label}>Daily calorie target</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Daily effort target (1-10)</Text>
        <Text style={styles.hint}>5 = move most days. 8 = serious training.</Text>
        <TextInput
          style={styles.input}
          value={activityTarget}
          onChangeText={setActivityTarget}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Reminders</Text>

        {MEAL_DEFAULTS.map((meal) => {
          const setting = getSettingForMeal(meal.type);
          const enabled = setting?.enabled ?? false;

          return (
            <View key={meal.type} style={styles.notifRow}>
              <Text style={styles.notifLabel}>{meal.label}</Text>
              <Text style={styles.notifTime}>{setting?.prompt_time || meal.defaultTime}</Text>
              <Switch
                value={enabled}
                onValueChange={(value) =>
                  updateSetting(meal.type, setting?.prompt_time || meal.defaultTime, value)
                }
              />
            </View>
          );
        })}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  hint: { fontSize: 13, color: '#34C759', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  saveButton: { backgroundColor: '#000', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notifLabel: { fontSize: 16, flex: 1 },
  notifTime: { fontSize: 14, color: '#999', marginRight: 12 },
  logoutButton: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
  logoutText: { fontSize: 16, color: '#FF3B30' },
});
