import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../lib/theme';

interface ProteinRingProps {
  current: number;
  target: number;
}

function getMessage(percent: number): string {
  if (percent >= 100) return 'Crushed it';
  if (percent >= 80) return 'Nice work';
  if (percent >= 50) return 'Keep going';
  return "Let's eat";
}

export function ProteinRing({ current, target }: ProteinRingProps) {
  const percent = Math.min((current / target) * 100, 100);
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const ringColor = percent >= 80 ? Colors.success : Colors.protein;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.current}>{Math.round(current)}</Text>
        <Text style={styles.target}>of {Math.round(target)}g protein</Text>
        <Text style={styles.message}>{getMessage(percent)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  textContainer: { position: 'absolute', alignItems: 'center' },
  current: { fontSize: 32, fontWeight: 'bold' },
  target: { fontSize: 12, color: Colors.textSecondary },
  message: { fontSize: 12, fontWeight: '600', marginTop: 4, color: Colors.success },
});
