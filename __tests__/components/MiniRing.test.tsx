import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MiniRing } from '../../src/components/MiniRing';
import { Colors } from '../../src/lib/theme';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Circle: View,
    Path: View,
  };
});

describe('MiniRing', () => {
  it('renders current value and label', () => {
    render(<MiniRing current={120} target={180} color={Colors.protein} label="Protein" />);
    expect(screen.getByText('120')).toBeTruthy();
    expect(screen.getByText('Protein')).toBeTruthy();
  });

  it('rounds current value', () => {
    render(<MiniRing current={123.7} target={180} color={Colors.carbs} label="Carbs" />);
    expect(screen.getByText('124')).toBeTruthy();
  });

  it('caps percent at 100', () => {
    // Should not crash when current exceeds target
    render(<MiniRing current={200} target={180} color={Colors.fat} label="Fat" />);
    expect(screen.getByText('200')).toBeTruthy();
  });

  it('handles zero target without crash', () => {
    render(<MiniRing current={0} target={0} color={Colors.protein} label="Protein" />);
    expect(screen.getByText('0')).toBeTruthy();
  });
});
