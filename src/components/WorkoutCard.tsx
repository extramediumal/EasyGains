import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../lib/theme';

interface WorkoutCardProps {
  workout: {
    id: string;
    workout_type: string;
    logged_at: string;
    total_effort_score: number;
    total_duration_min: number;
    total_calories_burned: number;
  };
  onPress: () => void;
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const time = new Date(workout.logged_at).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  const label = workout.workout_type.charAt(0).toUpperCase() + workout.workout_type.slice(1);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.effort}>Effort: {workout.total_effort_score}</Text>
        <Text style={styles.duration}>{workout.total_duration_min} min</Text>
      </View>
      <Text style={styles.secondary}>
        {workout.total_calories_burned} cal burned
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.cardBackground, borderRadius: Radii.card, padding: Spacing.cardPadding, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 16, fontWeight: '600' },
  time: { fontSize: 14, color: Colors.textMuted },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  effort: { fontSize: 16, fontWeight: '600' },
  duration: { fontSize: 14, color: Colors.textSecondary },
  secondary: { fontSize: 12, color: Colors.textMuted },
});
