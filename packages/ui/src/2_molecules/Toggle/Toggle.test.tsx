import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { noop } from '../../utils';
import { Toggle, ToggleAlignment } from './Toggle';

describe('Toggle', () => {
  test('renders with a label', () => {
    const { getByTestId, getByText } = render(
      <Toggle
        label="Custom label"
        checked
        onChange={noop}
        dataAttribute="test"
      />,
    );

    const toggle = getByTestId('test');
    expect(toggle).toBeDefined();

    const label = getByText('Custom label');
    expect(label).toBeInTheDocument();

    // Toggle is right-aligned by default
    expect(label).toHaveClass('labelRight');
  });

  test('renders with a label on the left', () => {
    const { getByText } = render(
      <Toggle
        label="Custom label"
        checked
        onChange={noop}
        alignment={ToggleAlignment.LEFT}
      />,
    );

    const label = getByText('Custom label');

    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('label');
    expect(label).not.toHaveClass('labelRight');
  });

  test('onChange is called after clicking on the label', () => {
    const mockFunction = jest.fn();

    const { getByText } = render(
      <Toggle label="Custom label" checked onChange={mockFunction} />,
    );

    const label = getByText('Custom label');
    userEvent.click(label);

    expect(mockFunction).toBeCalledTimes(1);
  });

  test('onChange is not called if disabled is set to true', () => {
    const mockFunction = jest.fn();

    const { getByText } = render(
      <Toggle label="Custom label" checked disabled onChange={mockFunction} />,
    );

    const label = getByText('Custom label');
    userEvent.click(label);

    expect(mockFunction).toBeCalledTimes(0);
  });

  test('can be rendered as inline block', () => {
    const { container } = render(
      <Toggle
        label="Custom label"
        checked
        inline
        onChange={noop}
        dataAttribute="test"
        className="customClass"
      />,
    );

    expect(container.firstChild).toHaveClass('inlineBlock');
  });
});
