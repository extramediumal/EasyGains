import React, { useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProteinRing } from '../../../src/components/ProteinRing';
import { ActivityRing } from '../../../src/components/ActivityRing';
import { MacroSummary } from '../../../src/components/MacroSummary';
import { MealCard } from '../../../src/components/MealCard';
import { WorkoutCard } from '../../../src/components/WorkoutCard';
import { useTodayMeals } from '../../../src/hooks/useTodayMeals';
import { useTodayWorkouts } from '../../../src/hooks/useTodayWorkouts';
import { useProfile } from '../../../src/hooks/useProfile';

export default function HomeScreen() {
  const { profile } = useProfile();
  const { meals, totals, loading: mealsLoading, refetch: refetchMeals } = useTodayMeals();
  const { workouts, totals: workoutTotals, loading: workoutsLoading, refetch: refetchWorkouts } = useTodayWorkouts();

  useFocusEffect(
    useCallback(() => {
      refetchMeals();
      refetchWorkouts();
    }, [refetchMeals, refetchWorkouts])
  );

  const proteinTarget = profile?.desired_weight_lbs || 160;
  const calorieTarget = profile?.calorie_target || 2000;
  const activityTarget = profile?.activity_target || 5;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Today</Text>

        <View style={styles.ringsRow}>
          <ProteinRing current={totals.protein} target={proteinTarget} />
          <ActivityRing current={workoutTotals.effort_score} target={activityTarget} />
        </View>

        <MacroSummary
          calories={totals.calories}
          calorieTarget={calorieTarget}
          carbs={totals.carbs}
          fat={totals.fat}
        />

        <Text style={styles.sectionHeader}>Meals</Text>
        {meals.length === 0 && !mealsLoading && (
          <Text style={styles.empty}>No meals logged yet. Tap the mic to start.</Text>
        )}
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onPress={() => router.push(`/(app)/meal/${meal.id}`)}
          />
        ))}

        <Text style={styles.sectionHeader}>Movement</Text>
        {workouts.length === 0 && !workoutsLoading && (
          <Text style={styles.empty}>No workouts logged yet. Tap the mic to start.</Text>
        )}
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => router.push(`/(app)/workout/${workout.id}`)}
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
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 8 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 24 },
});
