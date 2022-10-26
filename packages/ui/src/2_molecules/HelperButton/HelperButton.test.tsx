import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { HelperButton } from './HelperButton';

describe('HelperButton', () => {
  test('renders a HelperButton', () => {
    const { getByTestId } = render(
      <HelperButton content="Very useful information" dataAttribute="test" />,
    );

    const helperButton = getByTestId('test');
    expect(helperButton).toBeInTheDocument();

    const icon = helperButton.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('iconBlock');
  });

  test('tooltip is visible after hover', () => {
    const { getByTestId, getByText } = render(
      <HelperButton content="Very useful information" dataAttribute="test" />,
    );

    const helperButton = getByTestId('test');
    userEvent.hover(helperButton);

    const tooltip = getByText('Very useful information');
    expect(tooltip).toBeInTheDocument();
  });
});
