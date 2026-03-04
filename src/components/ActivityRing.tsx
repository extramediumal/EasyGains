import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ActivityRingProps {
  current: number;
  target: number;
}

function getMessage(percent: number): string {
  if (percent >= 100) return 'Beast mode';
  if (percent >= 80) return 'Active day!';
  if (percent >= 50) return 'Keep it up';
  if (percent > 0) return 'Nice start';
  return 'Rest day';
}

export function ActivityRing({ current, target }: ActivityRingProps) {
  const percent = Math.min((current / target) * 100, 100);
  const size = 160;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const ringColor = percent >= 80 ? '#34C759' : '#007AFF';

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#eee"
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
          <Text style={styles.current}>{Math.round(current * 10) / 10}</Text>
          <Text style={styles.target}>of {Math.round(target)} effort</Text>
        </View>
      </View>
      <Text style={[styles.message, { color: ringColor }]}>{getMessage(percent)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  container: { alignItems: 'center', justifyContent: 'center' },
  textContainer: { position: 'absolute', alignItems: 'center' },
  current: { fontSize: 32, fontWeight: 'bold' },
  target: { fontSize: 12, color: '#666' },
  message: { fontSize: 13, fontWeight: '600', marginTop: 6 },
});
