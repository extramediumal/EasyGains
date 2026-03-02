import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MicButton } from '../../src/components/MicButton';

jest.mock('react-native-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Svg: View,
    Path: View,
    Circle: View,
  };
});

describe('MicButton', () => {
  it('renders and is pressable', () => {
    const onPress = jest.fn();
    render(<MicButton onPress={onPress} />);
    const button = screen.getByTestId('mic-button');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
