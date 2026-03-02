import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProteinRing } from '../../../src/components/ProteinRing';
import { MacroSummary } from '../../../src/components/MacroSummary';
import { MealCard } from '../../../src/components/MealCard';
import { useTodayMeals } from '../../../src/hooks/useTodayMeals';
import { useProfile } from '../../../src/hooks/useProfile';

export default function HomeScreen() {
  const { profile } = useProfile();
  const { meals, totals, loading } = useTodayMeals();

  const proteinTarget = profile?.desired_weight_lbs || 160;
  const calorieTarget = profile?.calorie_target || 2000;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Today</Text>

        <ProteinRing current={totals.protein} target={proteinTarget} />

        <MacroSummary
          calories={totals.calories}
          calorieTarget={calorieTarget}
          carbs={totals.carbs}
          fat={totals.fat}
        />

        <Text style={styles.mealsHeader}>Meals</Text>
        {meals.length === 0 && !loading && (
          <Text style={styles.empty}>No meals logged yet. Tap the mic to start.</Text>
        )}
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onPress={() => router.push(`/(app)/meal/${meal.id}`)}
          />
        ))}

        {/* Spacer for mic button */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  mealsHeader: { fontSize: 18, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 24 },
});
