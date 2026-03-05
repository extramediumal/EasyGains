import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MiniRing } from './MiniRing';
import { getCalorieBudgetStatus } from '../lib/macroTargets';
import { Colors } from '../lib/theme';

interface MacroTriforceProps {
  proteinCurrent: number;
  proteinTarget: number;
  carbsCurrent: number;
  carbsTarget: number;
  fatCurrent: number;
  fatTarget: number;
  caloriesCurrent: number;
  caloriesTarget: number;
}

const RING_SIZE = 96;

const TINT_COLORS: Record<string, string> = {
  under: 'transparent',
  approaching: Colors.calorieTintApproaching,
  over: Colors.calorieTintOver,
};

export function MacroTriforce({
  proteinCurrent,
  proteinTarget,
  carbsCurrent,
  carbsTarget,
  fatCurrent,
  fatTarget,
  caloriesCurrent,
  caloriesTarget,
}: MacroTriforceProps) {
  const budgetStatus = getCalorieBudgetStatus(caloriesCurrent, caloriesTarget);

  return (
    <View
      style={[styles.container, { backgroundColor: TINT_COLORS[budgetStatus] }]}
      testID="triforce-container"
    >
      <View style={styles.topRow}>
        <MiniRing
          current={proteinCurrent}
          target={proteinTarget}
          color={Colors.protein}
          label="Protein"
          size={RING_SIZE}
          strokeWidth={8}
        />
      </View>
      <View style={styles.bottomRow}>
        <MiniRing
          current={carbsCurrent}
          target={carbsTarget}
          color={Colors.carbs}
          label="Carbs"
          size={RING_SIZE}
          strokeWidth={8}
        />
        <MiniRing
          current={fatCurrent}
          target={fatTarget}
          color={Colors.fat}
          label="Fat"
          size={RING_SIZE}
          strokeWidth={8}
        />
      </View>
      <Text style={styles.calorieText}>
        {Math.round(caloriesCurrent)} / {Math.round(caloriesTarget)} cal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 210,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  topRow: {
    alignItems: 'center',
    marginBottom: -4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: RING_SIZE * 2 + 4,
  },
  calorieText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 8,
    fontWeight: '500',
  },
});
