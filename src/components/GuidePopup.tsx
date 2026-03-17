// src/components/GuidePopup.tsx
import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { Button } from './Button';
import { Colors, Radii, Spacing } from '../lib/theme';

interface GuidePopupProps {
  visible: boolean;
  message: string;
  buttonText: string;
  onDismiss: () => void;
}

export function GuidePopup({ visible, message, buttonText, onDismiss }: GuidePopupProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.message}>{message}</Text>
          <Button title={buttonText} onPress={onDismiss} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenPadding,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radii.card,
    padding: Spacing.cardPadding * 2,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
    color: Colors.textPrimary,
  },
});
