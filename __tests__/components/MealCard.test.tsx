import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MealCard } from '../../src/components/MealCard';

const mockMeal = {
  id: '1',
  meal_type: 'lunch' as const,
  logged_at: '2026-03-02T12:00:00Z',
  total_calories: 650,
  total_protein: 45,
  total_carbs: 60,
  total_fat: 22,
};

describe('MealCard', () => {
  it('displays meal type and protein', () => {
    render(<MealCard meal={mockMeal} onPress={jest.fn()} />);
    expect(screen.getByText(/lunch/i)).toBeTruthy();
    expect(screen.getByText(/45g protein/i)).toBeTruthy();
  });

  it('displays calories', () => {
    render(<MealCard meal={mockMeal} onPress={jest.fn()} />);
    expect(screen.getByText(/650 cal/i)).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<MealCard meal={mockMeal} onPress={onPress} />);
    fireEvent.press(screen.getByText(/lunch/i));
    expect(onPress).toHaveBeenCalled();
  });
});
