import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

// Mock supabase BEFORE importing AuthProvider
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
  },
}));

import { AuthProvider, useAuth } from '../../src/providers/AuthProvider';

function TestConsumer() {
  const { session, loading } = useAuth();
  if (loading) return <Text>Loading</Text>;
  return <Text>{session ? 'Logged in' : 'Not logged in'}</Text>;
}

describe('AuthProvider', () => {
  it('provides auth state to children', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    // Initially loading, then resolves
    expect(await screen.findByText('Not logged in')).toBeTruthy();
  });
});
