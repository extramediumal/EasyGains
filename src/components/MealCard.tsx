import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface MealCardProps {
  meal: {
    id: string;
    meal_type: string;
    logged_at: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
  };
  onPress: () => void;
}

export function MealCard({ meal, onPress }: MealCardProps) {
  const time = new Date(meal.logged_at).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  const label = meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={styles.macros}>
        <Text style={styles.protein}>{meal.total_protein}g protein</Text>
        <Text style={styles.calories}>{meal.total_calories} cal</Text>
      </View>
      <Text style={styles.secondary}>
        C: {meal.total_carbs}g  F: {meal.total_fat}g
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f8f8f8', borderRadius: 12, padding: 16, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 16, fontWeight: '600' },
  time: { fontSize: 14, color: '#999' },
  macros: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  protein: { fontSize: 16, fontWeight: '600' },
  calories: { fontSize: 14, color: '#666' },
  secondary: { fontSize: 12, color: '#999' },
});
