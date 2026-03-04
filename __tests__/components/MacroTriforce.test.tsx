import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MacroTriforce } from '../../src/components/MacroTriforce';

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

describe('MacroTriforce', () => {
  const defaultProps = {
    proteinCurrent: 120,
    proteinTarget: 180,
    carbsCurrent: 150,
    carbsTarget: 200,
    fatCurrent: 40,
    fatTarget: 54,
    caloriesCurrent: 1400,
    caloriesTarget: 2000,
  };

  it('renders all three macro labels', () => {
    render(<MacroTriforce {...defaultProps} />);
    expect(screen.getByText('Protein')).toBeTruthy();
    expect(screen.getByText('Carbs')).toBeTruthy();
    expect(screen.getByText('Fat')).toBeTruthy();
  });

  it('renders macro current values', () => {
    render(<MacroTriforce {...defaultProps} />);
    expect(screen.getByText('120')).toBeTruthy();
    expect(screen.getByText('150')).toBeTruthy();
    expect(screen.getByText('40')).toBeTruthy();
  });

  it('renders calorie text', () => {
    render(<MacroTriforce {...defaultProps} />);
    expect(screen.getByText('1400 / 2000 cal')).toBeTruthy();
  });

  it('has transparent background when under budget', () => {
    const { getByTestId } = render(<MacroTriforce {...defaultProps} />);
    const container = getByTestId('triforce-container');
    const bgColor = container.props.style.find?.(
      (s: any) => s?.backgroundColor,
    )?.backgroundColor;
    expect(bgColor).toBe('transparent');
  });

  it('has yellow tint when approaching budget', () => {
    const { getByTestId } = render(
      <MacroTriforce {...defaultProps} caloriesCurrent={1850} />,
    );
    const container = getByTestId('triforce-container');
    const styles = container.props.style;
    const bgColor = Array.isArray(styles)
      ? styles.find((s: any) => s?.backgroundColor !== undefined)?.backgroundColor
      : styles?.backgroundColor;
    expect(bgColor).toBe('#FFF8E1');
  });

  it('has red tint when over budget', () => {
    const { getByTestId } = render(
      <MacroTriforce {...defaultProps} caloriesCurrent={2100} />,
    );
    const container = getByTestId('triforce-container');
    const styles = container.props.style;
    const bgColor = Array.isArray(styles)
      ? styles.find((s: any) => s?.backgroundColor !== undefined)?.backgroundColor
      : styles?.backgroundColor;
    expect(bgColor).toBe('#FFEBEE');
  });
});
