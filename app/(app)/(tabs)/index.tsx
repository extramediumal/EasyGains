import React, { useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MacroTriforce } from '../../../src/components/MacroTriforce';
import { ActivityRing } from '../../../src/components/ActivityRing';
import { computeMacroTargets } from '../../../src/lib/macroTargets';
import { MealCard } from '../../../src/components/MealCard';
import { WorkoutCard } from '../../../src/components/WorkoutCard';
import { useTodayMeals } from '../../../src/hooks/useTodayMeals';
import { useTodayWorkouts } from '../../../src/hooks/useTodayWorkouts';
import { useProfile } from '../../../src/hooks/useProfile';
import { useNotificationCheck } from '../../../src/hooks/useNotificationCheck';
import { Colors, Spacing } from '../../../src/lib/theme';
import { useGuideState } from '../../../src/hooks/useGuideState';
import { GuidePopup } from '../../../src/components/GuidePopup';
import { GUIDE_STEPS } from '../../../src/lib/guideSteps';

export default function HomeScreen() {
  const { profile, refetch: refetchProfile } = useProfile();
  useNotificationCheck(profile);
  const { meals, totals, loading: mealsLoading, refetch: refetchMeals } = useTodayMeals();
  const { workouts, totals: workoutTotals, loading: workoutsLoading, refetch: refetchWorkouts } = useTodayWorkouts();
  const { currentStep, isGuideComplete, advanceStep } = useGuideState();

  async function handleGuideDismiss() {
    await advanceStep();
    // After step 4 (last popup "Take me there"), navigate to settings
    if (currentStep >= 4) {
      router.push('/(app)/(tabs)/settings');
    }
  }

  useFocusEffect(
    useCallback(() => {
      refetchProfile();
      refetchMeals();
      refetchWorkouts();
    }, [refetchProfile, refetchMeals, refetchWorkouts])
  );

  const macroTargets = computeMacroTargets(
    profile?.desired_weight_lbs || 160,
    profile?.calorie_target || 2000,
  );
  const activityTarget = profile?.activity_target || 4;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.header}>Today</Text>

        <View style={styles.ringsRow}>
          <View style={styles.ringCard}>
            <MacroTriforce
              proteinCurrent={totals.protein}
              proteinTarget={macroTargets.protein}
              carbsCurrent={totals.carbs}
              carbsTarget={macroTargets.carbs}
              fatCurrent={totals.fat}
              fatTarget={macroTargets.fat}
              caloriesCurrent={totals.calories}
              caloriesTarget={macroTargets.calories}
            />
          </View>
          <View style={styles.ringCard}>
            <ActivityRing current={workoutTotals.effort_score} target={activityTarget} />
          </View>
        </View>

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

        <View style={{ height: 80 }} />
      </ScrollView>
      {!isGuideComplete && currentStep >= 2 && currentStep <= 4 && (
        <GuidePopup
          visible={true}
          message={GUIDE_STEPS[currentStep]?.message || ''}
          buttonText={GUIDE_STEPS[currentStep]?.buttonText || 'Next'}
          onDismiss={handleGuideDismiss}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { paddingHorizontal: Spacing.screenPadding, paddingTop: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch', marginBottom: 8, marginHorizontal: -Spacing.screenPadding, paddingHorizontal: 8 },
  ringCard: { flex: 1, backgroundColor: Colors.cardBackground, borderRadius: 16, padding: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  sectionHeader: { fontSize: 18, fontWeight: '600', marginTop: 8, marginBottom: 12 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: 24 },
});
