import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('renders primary variant', () => {
    render(<Button title="Save" onPress={() => {}} variant="primary" />);
    expect(screen.getByText('Save')).toBeTruthy();
    expect(screen.getByTestId('button-primary')).toBeTruthy();
  });

  it('renders secondary variant', () => {
    render(<Button title="Cancel" onPress={() => {}} variant="secondary" />);
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByTestId('button-secondary')).toBeTruthy();
  });

  it('renders destructive variant', () => {
    render(<Button title="Delete" onPress={() => {}} variant="destructive" />);
    expect(screen.getByText('Delete')).toBeTruthy();
    expect(screen.getByTestId('button-destructive')).toBeTruthy();
  });

  it('renders ghost variant', () => {
    render(<Button title="Back" onPress={() => {}} variant="ghost" />);
    expect(screen.getByText('Back')).toBeTruthy();
    expect(screen.getByTestId('button-ghost')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<Button title="Tap me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with an icon', () => {
    const icon = <Text testID="test-icon">←</Text>;
    render(<Button title="Back" onPress={() => {}} icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeTruthy();
    expect(screen.getByText('Back')).toBeTruthy();
  });
});
