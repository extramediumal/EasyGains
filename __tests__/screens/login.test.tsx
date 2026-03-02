import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../../app/(auth)/login';

// Mock supabase
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
  },
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn() },
  Link: ({ children }: any) => children,
}));

describe('LoginScreen', () => {
  it('renders email and password inputs and login button', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByText('Log In')).toBeTruthy();
  });

  it('renders link to sign up', () => {
    render(<LoginScreen />);
    expect(screen.getByText(/sign up/i)).toBeTruthy();
  });
});
