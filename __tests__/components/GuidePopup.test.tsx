// __tests__/components/GuidePopup.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GuidePopup } from '../../src/components/GuidePopup';

describe('GuidePopup', () => {
  it('renders message and button', () => {
    const { getByText } = render(
      <GuidePopup
        visible={true}
        message="Welcome to EasyGains."
        buttonText="Got it"
        onDismiss={() => {}}
      />,
    );
    expect(getByText('Welcome to EasyGains.')).toBeTruthy();
    expect(getByText('Got it')).toBeTruthy();
  });

  it('calls onDismiss when button pressed', () => {
    const onDismiss = jest.fn();
    const { getByText } = render(
      <GuidePopup
        visible={true}
        message="Test"
        buttonText="Next"
        onDismiss={onDismiss}
      />,
    );
    fireEvent.press(getByText('Next'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <GuidePopup
        visible={false}
        message="Hidden"
        buttonText="OK"
        onDismiss={() => {}}
      />,
    );
    expect(queryByText('Hidden')).toBeNull();
  });
});
