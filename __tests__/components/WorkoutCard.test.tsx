import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { WorkoutCard } from '../../src/components/WorkoutCard';

const mockWorkout = {
  id: '1',
  workout_type: 'strength',
  logged_at: '2026-03-02T09:00:00Z',
  total_effort_score: 7,
  total_duration_min: 45,
  total_calories_burned: 320,
};

describe('WorkoutCard', () => {
  it('displays workout type', () => {
    render(<WorkoutCard workout={mockWorkout} onPress={jest.fn()} />);
    expect(screen.getByText(/strength/i)).toBeTruthy();
  });

  it('displays effort score', () => {
    render(<WorkoutCard workout={mockWorkout} onPress={jest.fn()} />);
    expect(screen.getByText(/effort: 7/i)).toBeTruthy();
  });

  it('displays duration', () => {
    render(<WorkoutCard workout={mockWorkout} onPress={jest.fn()} />);
    expect(screen.getByText(/45 min/i)).toBeTruthy();
  });

  it('displays calories burned', () => {
    render(<WorkoutCard workout={mockWorkout} onPress={jest.fn()} />);
    expect(screen.getByText(/320 cal burned/i)).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    render(<WorkoutCard workout={mockWorkout} onPress={onPress} />);
    fireEvent.press(screen.getByText(/strength/i));
    expect(onPress).toHaveBeenCalled();
  });
});
