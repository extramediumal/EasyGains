import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroSummaryProps {
  calories: number;
  calorieTarget: number;
  carbs: number;
  fat: number;
}

export function MacroSummary({ calories, calorieTarget, carbs, fat }: MacroSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.calorieRow}>
        <Text style={styles.calorieLabel}>Calories</Text>
        <Text style={styles.calorieValue}>
          {Math.round(calories)} <Text style={styles.calorieTarget}>/ {calorieTarget}</Text>
        </Text>
      </View>
      <View style={styles.macroRow}>
        <Text style={styles.macroText}>Carbs: {Math.round(carbs)}g</Text>
        <Text style={styles.macroText}>Fat: {Math.round(fat)}g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, marginBottom: 16 },
  calorieRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  calorieLabel: { fontSize: 16, fontWeight: '600' },
  calorieValue: { fontSize: 16, fontWeight: '600' },
  calorieTarget: { color: '#999', fontWeight: 'normal' },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  macroText: { fontSize: 13, color: '#999' },
});
