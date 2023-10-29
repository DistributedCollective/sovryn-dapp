import { render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { AmountRenderer } from './AmountRenderer';

jest.mock('nanoid', () => {
  return { nanoid: () => '1234' };
});

jest.mock('../../../contexts/NotificationContext', () => {
  return {
    useNotificationContext: () => ({
      addNotification: jest.fn(),
    }),
  };
});

describe('AmountRenderer', () => {
  it('renders with value more than 1', () => {
    render(<AmountRenderer value={1.234} />);

    const value = screen.getByText(/1.234/);
    expect(value).toBeInTheDocument();
  });

  it('renders with rounded value when amount is less than 1', () => {
    render(<AmountRenderer isAnimated={false} value={0.0000123} />);

    const roundedValue = screen.getByText(/~ 0.00001/);
    expect(roundedValue).toBeInTheDocument();
  });

  test('renders with rounded value when amount is between 0 and 1', () => {
    render(<AmountRenderer value={0.00000000123} />);

    const roundedValue = screen.getByText(/~ 0.000000001/);
    expect(roundedValue).toBeInTheDocument();
  });

  test('renders with rounded value when amount is very small', () => {
    render(<AmountRenderer value={0.000000000000000123} />);

    const roundedValue = screen.getByText(/~ 0.0000000000000001/);
    expect(roundedValue).toBeInTheDocument();
  });
});
