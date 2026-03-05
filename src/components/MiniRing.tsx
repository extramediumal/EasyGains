import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../lib/theme';

interface MiniRingProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  hitColor?: string;
  label: string;
}

export function MiniRing({
  current,
  target,
  size = 56,
  strokeWidth = 6,
  color,
  hitColor = Colors.success,
  label,
}: MiniRingProps) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const ringColor = percent >= 80 ? hitColor : color;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
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
        <Text style={styles.value}>{Math.round(current)}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  textContainer: { position: 'absolute', alignItems: 'center' },
  value: { fontSize: 22, fontWeight: 'bold' },
  label: { fontSize: 12, color: Colors.textMuted, marginTop: 2, letterSpacing: 0.5 },
});
