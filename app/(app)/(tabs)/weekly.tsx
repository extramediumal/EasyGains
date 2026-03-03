import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { useWeeklyMeals } from '../../../src/hooks/useWeeklyMeals';
import { useWeeklyWorkouts } from '../../../src/hooks/useWeeklyWorkouts';
import { useProfile } from '../../../src/hooks/useProfile';

export default function WeeklyScreen() {
  const { dailyBreakdown, weeklyAvg, loading } = useWeeklyMeals();
  const { dailyBreakdown: workoutBreakdown, weeklyAvg: workoutAvg } = useWeeklyWorkouts();
  const { profile } = useProfile();

  const proteinTarget = profile?.desired_weight_lbs || 160;
  const activityTarget = profile?.activity_target || 5;

  const proteinBarData = dailyBreakdown.map((day) => ({
    value: day.protein,
    label: day.label,
    frontColor: day.protein >= proteinTarget * 0.8 ? '#34C759' : '#ccc',
  }));

  const effortBarData = workoutBreakdown.map((day) => ({
    value: day.effort_score,
    label: day.label,
    frontColor: day.effort_score >= activityTarget * 0.8 ? '#34C759' : '#007AFF',
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>This Week</Text>

        {/* Hero metric: weekly protein avg */}
        <View style={styles.heroSection}>
          <Text style={styles.heroValue}>{weeklyAvg.protein}g</Text>
          <Text style={styles.heroLabel}>avg daily protein</Text>
          <Text style={styles.heroTarget}>Target: {proteinTarget}g</Text>
        </View>

        {/* Protein bar chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Daily Protein</Text>
          {proteinBarData.length > 0 && (
            <BarChart
              data={proteinBarData}
              barWidth={28}
              spacing={16}
              noOfSections={4}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              xAxisLabelTextStyle={styles.chartLabel}
              height={150}
            />
          )}
        </View>

        {/* Calorie avg */}
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Avg daily calories</Text>
          <Text style={styles.statValue}>{weeklyAvg.calories}</Text>
        </View>

        {/* Carbs/fat - small, not stressed */}
        <View style={styles.secondaryRow}>
          <Text style={styles.secondaryText}>Avg carbs: {weeklyAvg.carbs}g</Text>
          <Text style={styles.secondaryText}>Avg fat: {weeklyAvg.fat}g</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Effort hero metric */}
        <View style={styles.heroSection}>
          <Text style={styles.heroValue}>{workoutAvg.effort_score}</Text>
          <Text style={styles.heroLabel}>avg daily effort</Text>
          <Text style={styles.heroTarget}>Target: {activityTarget}</Text>
        </View>

        {/* Effort bar chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Daily Effort</Text>
          {effortBarData.length > 0 && (
            <BarChart
              data={effortBarData}
              barWidth={28}
              spacing={16}
              noOfSections={4}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              xAxisLabelTextStyle={styles.chartLabel}
              height={150}
            />
          )}
        </View>

        {/* Movement stats */}
        <View style={styles.secondaryRow}>
          <Text style={styles.secondaryText}>Avg duration: {workoutAvg.duration_min} min</Text>
          <Text style={styles.secondaryText}>Avg cal burned: {workoutAvg.calories_burned}</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  heroValue: { fontSize: 48, fontWeight: 'bold' },
  heroLabel: { fontSize: 16, color: '#666', marginTop: 4 },
  heroTarget: { fontSize: 14, color: '#999', marginTop: 2 },
  chartContainer: { marginBottom: 24 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  chartLabel: { fontSize: 12, color: '#999' },
  stat: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { fontSize: 16 },
  statValue: { fontSize: 16, fontWeight: '600' },
  secondaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  secondaryText: { fontSize: 13, color: '#999' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 32 },
});
