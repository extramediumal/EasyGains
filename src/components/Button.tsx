import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Radii, Spacing } from '../lib/theme';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [styles.base, variantStyles[variant].container];
  const textStyle: TextStyle[] = [styles.text, variantStyles[variant].text];

  if (disabled) {
    containerStyle.push(styles.disabled);
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={`button-${variant}`}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.button,
    paddingVertical: Spacing.buttonPaddingV,
    paddingHorizontal: Spacing.buttonPaddingH,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginRight: 8,
  },
});

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: Colors.primary },
    text: { color: Colors.white },
  },
  secondary: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    text: { color: Colors.primary },
  },
  destructive: {
    container: { backgroundColor: Colors.destructive },
    text: { color: Colors.white },
  },
  ghost: {
    container: { backgroundColor: 'transparent', paddingHorizontal: 0, paddingVertical: 8 },
    text: { color: Colors.textSecondary },
  },
};
