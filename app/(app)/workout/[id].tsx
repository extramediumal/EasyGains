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

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { exercises, deleteExercise } = useWorkoutExercises(id!);

  async function handleDeleteExercise(exerciseId: string, name: string) {
    Alert.alert('Delete exercise', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteExercise(exerciseId);
          // Recalculate workout totals
          const remaining = exercises.filter((e) => e.id !== exerciseId);
          const totals = remaining.reduce(
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
              total_effort_score: totals.effort_score,
              total_duration_min: totals.duration_min,
              total_calories_burned: totals.calories_burned,
            })
            .eq('id', id);

          // If no exercises left, delete the workout
          if (remaining.length === 0) {
            await supabase.from('workouts').delete().eq('id', id);
            router.back();
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
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeleteWorkout}>
          <Text style={styles.deleteAll}>Delete workout</Text>
        </TouchableOpacity>
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
            <TouchableOpacity onPress={() => handleDeleteExercise(exercise.id, exercise.name)}>
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  backText: { fontSize: 16, color: '#000' },
  deleteAll: { fontSize: 16, color: '#FF3B30' },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemDetail: { fontSize: 13, color: '#999', marginTop: 2 },
  itemStats: { fontSize: 13, color: '#666', marginTop: 4 },
  deleteText: { fontSize: 24, color: '#FF3B30', paddingLeft: 12 },
});
