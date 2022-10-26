import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { AmountInput } from './AmountInput';

let languageGetter;

beforeEach(() => {
  languageGetter = jest.spyOn(window.navigator, 'language', 'get');
});

describe('AmountInput', () => {
  test('renders with a label and a unit', () => {
    const { getByTestId, getByText } = render(
      <AmountInput label="Amount" unit="BTC" dataLayoutId="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toBeDefined();

    const label = getByText('Amount');
    expect(label).toBeInTheDocument();

    const unit = getByText('BTC');
    expect(unit).toBeInTheDocument();
  });

  test('correctly formats a number value', () => {
    const { getByTestId } = render(
      <AmountInput
        value={0.12345678}
        decimalPrecision={3}
        dataLayoutId="test"
      />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(0.123);
  });

  test('correctly formats a string value', () => {
    const { getByTestId } = render(
      <AmountInput
        value="0.12345678"
        decimalPrecision={3}
        dataLayoutId="test"
      />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(0.123);
  });

  test('allows value changes', () => {
    const { getByTestId } = render(
      <AmountInput value="2" dataLayoutId="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(2);

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue(4);
  });

  test('does not allow value changes if it is readonly', () => {
    const { getByTestId } = render(
      <AmountInput value="2" readOnly dataLayoutId="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(2);

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue(2);
  });

  test('does not allow value changes if it is disabled', () => {
    const { getByTestId } = render(
      <AmountInput value="2" disabled dataLayoutId="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(2);

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue(2);
  });

  test('sets up localization', () => {
    languageGetter.mockReturnValue('sk-SK');

    const { getByTestId } = render(
      <AmountInput value="2.4" dataLayoutId="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveProperty('lang', 'sk-SK');
  });
});
