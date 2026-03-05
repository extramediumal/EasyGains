import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radii } from '../lib/theme';

interface ClarifyingOptionsProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
}

export function ClarifyingOptions({ question, options, onSelect }: ClarifyingOptionsProps) {
  return (
    <View style={styles.container}>
      {question ? <Text style={styles.question}>{question}</Text> : null}
      <View style={styles.chips}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.chip}
            onPress={() => onSelect(option)}
          >
            <Text style={styles.chipText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  question: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: Colors.chipBackground,
    borderRadius: Radii.chip,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: { fontSize: 15 },
});
