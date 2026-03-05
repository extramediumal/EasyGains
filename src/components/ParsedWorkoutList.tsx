import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii } from '../lib/theme';

interface ExerciseItem {
  name: string;
  detail: string;
  duration_min: number;
  calories_burned: number;
  effort_score: number;
}

interface ParsedWorkoutListProps {
  exercises: ExerciseItem[];
}

export function ParsedWorkoutList({ exercises }: ParsedWorkoutListProps) {
  return (
    <View style={styles.container}>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.header}>
            <Text style={styles.name}>{exercise.name}</Text>
            <Text style={styles.effort}>Effort: {exercise.effort_score}</Text>
          </View>
          <View style={styles.stats}>
            <Text style={styles.detail}>{exercise.detail}</Text>
            <Text style={styles.secondary}>{exercise.duration_min} min</Text>
            <Text style={styles.secondary}>{exercise.calories_burned} cal</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  item: { backgroundColor: Colors.cardBackground, borderRadius: Radii.card, padding: 14, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontSize: 16, fontWeight: '600' },
  effort: { fontSize: 14, fontWeight: '600', color: Colors.effort },
  stats: { flexDirection: 'row', gap: 12 },
  detail: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  secondary: { fontSize: 13, color: Colors.textMuted },
});
