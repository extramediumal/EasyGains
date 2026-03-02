import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ParsedFoodListProps {
  foods: FoodItem[];
}

export function ParsedFoodList({ foods }: ParsedFoodListProps) {
  return (
    <View style={styles.container}>
      {foods.map((food, index) => (
        <View key={index} style={styles.item}>
          <View style={styles.header}>
            <Text style={styles.name}>{food.name}</Text>
            <Text style={styles.portion}>{food.portion}</Text>
          </View>
          <View style={styles.macros}>
            <Text style={styles.protein}>{food.protein}g P</Text>
            <Text style={styles.macro}>{food.calories} cal</Text>
            <Text style={styles.secondary}>C: {food.carbs}g</Text>
            <Text style={styles.secondary}>F: {food.fat}g</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  item: { backgroundColor: '#f8f8f8', borderRadius: 12, padding: 14, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontSize: 16, fontWeight: '600' },
  portion: { fontSize: 14, color: '#999' },
  macros: { flexDirection: 'row', gap: 12 },
  protein: { fontSize: 14, fontWeight: '600' },
  macro: { fontSize: 14, color: '#666' },
  secondary: { fontSize: 13, color: '#999' },
});
