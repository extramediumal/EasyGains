import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ProteinRing } from '../../src/components/ProteinRing';

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

describe('ProteinRing', () => {
  it('displays current and target protein', () => {
    render(<ProteinRing current={120} target={180} />);
    expect(screen.getByText('120')).toBeTruthy();
    expect(screen.getByText(/180g/)).toBeTruthy();
  });

  it('shows encouraging message at 80%+', () => {
    render(<ProteinRing current={150} target={180} />);
    expect(screen.getByText(/nice/i)).toBeTruthy();
  });

  it('shows celebration at 100%', () => {
    render(<ProteinRing current={180} target={180} />);
    expect(screen.getByText(/crushed it/i)).toBeTruthy();
  });
});
