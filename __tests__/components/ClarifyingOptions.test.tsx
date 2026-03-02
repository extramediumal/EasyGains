import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ClarifyingOptions } from '../../src/components/ClarifyingOptions';

describe('ClarifyingOptions', () => {
  it('renders question and options as tappable chips', () => {
    const onSelect = jest.fn();
    render(
      <ClarifyingOptions
        question="What kind of bread?"
        options={['White', 'Wheat', 'Sourdough']}
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('What kind of bread?')).toBeTruthy();
    expect(screen.getByText('White')).toBeTruthy();
    expect(screen.getByText('Wheat')).toBeTruthy();
    fireEvent.press(screen.getByText('Wheat'));
    expect(onSelect).toHaveBeenCalledWith('Wheat');
  });
});
