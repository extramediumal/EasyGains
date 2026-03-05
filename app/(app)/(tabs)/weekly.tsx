import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import { useWeeklyMeals } from '../../../src/hooks/useWeeklyMeals';
import { useWeeklyWorkouts } from '../../../src/hooks/useWeeklyWorkouts';
import { useProfile } from '../../../src/hooks/useProfile';
import { computeMacroTargets } from '../../../src/lib/macroTargets';
import { Colors, Radii, Spacing } from '../../../src/lib/theme';

const MINI_CHART_HEIGHT = 100;
const MINI_BAR_WIDTH = 20;
const MINI_BAR_SPACING = 12;

export default function WeeklyScreen() {
  const { dailyBreakdown, weeklyAvg, loading, refetch: refetchMeals } = useWeeklyMeals();
  const { dailyBreakdown: workoutBreakdown, weeklyAvg: workoutAvg, refetch: refetchWorkouts } = useWeeklyWorkouts();
  const { profile, refetch: refetchProfile } = useProfile();
  const [macrosExpanded, setMacrosExpanded] = useState(false);

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
  const proteinTarget = macroTargets.protein;
  const activityTarget = profile?.activity_target || 4;

  // Calorie chart data (hero)
  const calorieBarData = dailyBreakdown.map((day) => ({
    value: day.calories,
    label: day.label,
    frontColor: day.calories <= macroTargets.calories ? Colors.success : Colors.destructive,
  }));

  // Macro chart data (inside breakdown)
  const proteinBarData = dailyBreakdown.map((day) => ({
    value: day.protein,
    label: day.label,
    frontColor: day.protein >= proteinTarget * 0.8 ? Colors.success : Colors.protein,
  }));

  const carbsBarData = dailyBreakdown.map((day) => ({
    value: day.carbs,
    label: day.label,
    frontColor: day.carbs >= macroTargets.carbs * 0.8 ? Colors.success : Colors.carbs,
  }));

  const fatBarData = dailyBreakdown.map((day) => ({
    value: day.fat,
    label: day.label,
    frontColor: day.fat >= macroTargets.fat * 0.8 ? Colors.success : Colors.fat,
  }));

  const effortBarData = workoutBreakdown.map((day) => ({
    value: day.effort_score,
    label: day.label,
    frontColor: day.effort_score >= activityTarget * 0.8 ? Colors.success : Colors.effort,
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>This Week</Text>

        {/* Calorie hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroValue}>{weeklyAvg.calories}</Text>
          <Text style={styles.heroLabel}>avg daily calories</Text>
          <Text style={styles.heroTarget}>Target: {macroTargets.calories}</Text>
        </View>

        {/* Calorie bar chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Daily Calories</Text>
          {calorieBarData.length > 0 && (
            <BarChart
              data={calorieBarData}
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

        {/* Macro Breakdown - collapsible */}
        <TouchableOpacity
          style={styles.expandToggle}
          onPress={() => setMacrosExpanded(!macrosExpanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandTitle}>Macro Breakdown</Text>
          <Text style={styles.expandChevron}>{macrosExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {macrosExpanded && (
          <View style={styles.macroBreakdownCard}>
            {/* Protein */}
            <View style={styles.macroSection}>
              <View style={styles.macroHeader}>
                <View style={[styles.macroIndicator, { backgroundColor: Colors.protein }]} />
                <Text style={styles.macroLabel}>Protein</Text>
                <Text style={styles.macroValue}>{weeklyAvg.protein}g / {macroTargets.protein}g avg</Text>
              </View>
              {proteinBarData.length > 0 && (
                <BarChart
                  data={proteinBarData}
                  barWidth={MINI_BAR_WIDTH}
                  spacing={MINI_BAR_SPACING}
                  noOfSections={3}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  xAxisLabelTextStyle={styles.miniChartLabel}
                  height={MINI_CHART_HEIGHT}
                />
              )}
            </View>

            <View style={styles.macroSeparator} />

            {/* Carbs */}
            <View style={styles.macroSection}>
              <View style={styles.macroHeader}>
                <View style={[styles.macroIndicator, { backgroundColor: Colors.carbs }]} />
                <Text style={styles.macroLabel}>Carbs</Text>
                <Text style={styles.macroValue}>{weeklyAvg.carbs}g / {macroTargets.carbs}g avg</Text>
              </View>
              {carbsBarData.length > 0 && (
                <BarChart
                  data={carbsBarData}
                  barWidth={MINI_BAR_WIDTH}
                  spacing={MINI_BAR_SPACING}
                  noOfSections={3}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  xAxisLabelTextStyle={styles.miniChartLabel}
                  height={MINI_CHART_HEIGHT}
                />
              )}
            </View>

            <View style={styles.macroSeparator} />

            {/* Fat */}
            <View style={styles.macroSection}>
              <View style={styles.macroHeader}>
                <View style={[styles.macroIndicator, { backgroundColor: Colors.fat }]} />
                <Text style={styles.macroLabel}>Fat</Text>
                <Text style={styles.macroValue}>{weeklyAvg.fat}g / {macroTargets.fat}g avg</Text>
              </View>
              {fatBarData.length > 0 && (
                <BarChart
                  data={fatBarData}
                  barWidth={MINI_BAR_WIDTH}
                  spacing={MINI_BAR_SPACING}
                  noOfSections={3}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  hideRules
                  xAxisLabelTextStyle={styles.miniChartLabel}
                  height={MINI_CHART_HEIGHT}
                />
              )}
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Effort hero */}
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
        <View style={styles.movementStats}>
          <View style={styles.movementStatCard}>
            <Text style={styles.movementStatValue}>{workoutAvg.duration_min} min</Text>
            <Text style={styles.movementStatLabel}>Avg duration</Text>
          </View>
          <View style={styles.movementStatCard}>
            <Text style={styles.movementStatValue}>{workoutAvg.calories_burned}</Text>
            <Text style={styles.movementStatLabel}>Avg cal burned</Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.screenPadding },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  heroValue: { fontSize: 48, fontWeight: 'bold' },
  heroLabel: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
  heroTarget: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  chartContainer: { marginBottom: 24 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  chartLabel: { fontSize: 12, color: Colors.textMuted },
  expandToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    paddingVertical: 14,
    paddingHorizontal: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  expandTitle: { fontSize: 16, fontWeight: '600' },
  expandChevron: { fontSize: 14, color: Colors.textMuted },
  macroBreakdownCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    padding: Spacing.cardPadding,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  macroSection: {
    paddingVertical: 8,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  macroLabel: { fontSize: 15, fontWeight: '600', marginRight: 8 },
  macroValue: { fontSize: 14, color: Colors.textSecondary },
  macroSeparator: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 8,
  },
  miniChartLabel: { fontSize: 10, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 32 },
  movementStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  movementStatCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: Radii.card,
    padding: Spacing.cardPadding,
    alignItems: 'center',
  },
  movementStatValue: { fontSize: 18, fontWeight: 'bold' },
  movementStatLabel: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
});
