import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ClarifyingOptionsProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
}

export function ClarifyingOptions({ question, options, onSelect }: ClarifyingOptionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: { fontSize: 15 },
});
