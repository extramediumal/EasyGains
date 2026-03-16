import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationSlider } from '../../src/components/NotificationSlider';

describe('NotificationSlider', () => {
  it('renders with current level', () => {
    const { getByTestId } = render(
      <NotificationSlider level={3} onLevelChange={() => {}} />,
    );
    expect(getByTestId('notification-slider')).toBeTruthy();
  });

  it('displays endpoint labels', () => {
    const { getByText } = render(
      <NotificationSlider level={3} onLevelChange={() => {}} />,
    );
    expect(getByText('🔕')).toBeTruthy();
    expect(getByText('📣')).toBeTruthy();
  });

  it('shows level indicator dots', () => {
    const { getAllByTestId } = render(
      <NotificationSlider level={3} onLevelChange={() => {}} />,
    );
    const dots = getAllByTestId(/slider-dot/);
    expect(dots.length).toBe(5);
  });

  it('calls onLevelChange when dot is pressed', () => {
    const onLevelChange = jest.fn();
    const { getByTestId } = render(
      <NotificationSlider level={3} onLevelChange={onLevelChange} />,
    );
    fireEvent.press(getByTestId('slider-dot-4'));
    expect(onLevelChange).toHaveBeenCalledWith(4);
  });
});
