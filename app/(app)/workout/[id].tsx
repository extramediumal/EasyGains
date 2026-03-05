import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutExercises } from '../../../src/hooks/useWorkoutExercises';
import { supabase } from '../../../src/lib/supabase';
import { Button } from '../../../src/components/Button';
import { Colors, Radii, Spacing } from '../../../src/lib/theme';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, deleteExercise } = useWorkoutExercises(id!);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/(tabs)');
  }

  async function handleDeleteExercise(exerciseId: string, name: string) {
    Alert.alert('Delete exercise', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteExercise(exerciseId);
          const remaining = exercises.filter((e) => e.id !== exerciseId);
          const sums = remaining.reduce(
            (acc, e) => ({
              effort_score: acc.effort_score + e.effort_score,
              duration_min: acc.duration_min + e.duration_min,
              calories_burned: acc.calories_burned + e.calories_burned,
            }),
            { effort_score: 0, duration_min: 0, calories_burned: 0 }
          );
          await supabase
            .from('workouts')
            .update({
              total_effort_score: remaining.length > 0
                ? Math.round(sums.effort_score / remaining.length)
                : 0,
              total_duration_min: sums.duration_min,
              total_calories_burned: sums.calories_burned,
            })
            .eq('id', id);

          if (remaining.length === 0) {
            await supabase.from('workouts').delete().eq('id', id);
            goBack();
          }
        },
      },
    ]);
  }

  async function handleDeleteWorkout() {
    Alert.alert('Delete workout', 'Delete this entire workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('workouts').delete().eq('id', id);
          router.back();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Button title="Back" onPress={goBack} variant="secondary" />
        <Button title="Delete workout" onPress={handleDeleteWorkout} variant="destructive" />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Exercises</Text>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{exercise.name}</Text>
              <Text style={styles.itemDetail}>{exercise.detail}</Text>
              <Text style={styles.itemStats}>
                Effort: {exercise.effort_score} · {exercise.duration_min} min · {exercise.calories_burned} cal
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteExercise(exercise.id, exercise.name)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.cardPadding, paddingVertical: 8 },
  container: { flex: 1, padding: Spacing.cardPadding },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    padding: 14,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemDetail: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  itemStats: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: { fontSize: 20, color: Colors.white, fontWeight: '600', marginTop: -1 },
});
