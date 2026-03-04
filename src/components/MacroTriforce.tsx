import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MiniRing } from './MiniRing';
import { getCalorieBudgetStatus } from '../lib/macroTargets';

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
  approaching: '#FFF8E1',
  over: '#FFEBEE',
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
          color="#000"
          label="Protein"
          size={RING_SIZE}
          strokeWidth={8}
        />
      </View>
      <View style={styles.bottomRow}>
        <MiniRing
          current={carbsCurrent}
          target={carbsTarget}
          color="#FF9500"
          label="Carbs"
          size={RING_SIZE}
          strokeWidth={8}
        />
        <MiniRing
          current={fatCurrent}
          target={fatTarget}
          color="#AF52DE"
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
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
});
