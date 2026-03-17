import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import OnboardingScreen from '../../app/(app)/onboarding';

jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ error: null }),
      }),
    }),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'test-id' } } }),
    },
  },
}));

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
}));

describe('OnboardingScreen', () => {
  it('renders weight and calorie inputs', () => {
    render(<OnboardingScreen />);
    expect(screen.getByText(/desired weight/i)).toBeTruthy();
    expect(screen.getByText(/calorie target/i)).toBeTruthy();
    expect(screen.getByText(/let's go/i)).toBeTruthy();
  });
});
