import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radii } from '../lib/theme';
import { NotificationLevel } from '../types/database';

interface NotificationSliderProps {
  level: NotificationLevel;
  onLevelChange: (level: NotificationLevel) => void;
  disabled?: boolean;
}

const LEVELS: NotificationLevel[] = [1, 2, 3, 4, 5];

export function NotificationSlider({ level, onLevelChange, disabled = false }: NotificationSliderProps) {
  return (
    <View testID="notification-slider" style={styles.container}>
      <Text style={styles.endpoint}>🔕</Text>
      <View style={styles.track}>
        {LEVELS.map((l) => (
          <TouchableOpacity
            key={l}
            testID={`slider-dot-${l}`}
            style={[
              styles.dot,
              l <= level ? styles.dotActive : styles.dotInactive,
              disabled && styles.dotDisabled,
            ]}
            onPress={() => onLevelChange(l)}
            disabled={disabled}
          />
        ))}
      </View>
      <Text style={styles.endpoint}>📣</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  endpoint: {
    fontSize: 20,
  },
  track: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    height: 40,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: Colors.chipBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  dotDisabled: {
    opacity: 0.4,
  },
});
