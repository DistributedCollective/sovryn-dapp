import { render, waitFor } from '@testing-library/react';
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
      <AmountInput label="Amount" unit="BTC" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toBeDefined();

    const label = getByText('Amount');
    expect(label).toBeInTheDocument();

    const unit = getByText('BTC');
    expect(unit).toBeInTheDocument();
  });

  test('correctly formats initial number value', () => {
    const { getByTestId } = render(
      <AmountInput
        value={0.12345678}
        decimalPrecision={3}
        dataAttribute="test"
      />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(0.123);
  });

  test('correctly formats initial string value', () => {
    const { getByTestId } = render(
      <AmountInput
        value="0.12345678"
        decimalPrecision={3}
        dataAttribute="test"
      />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(0.123);
  });

  test('correctly formats a value when rounding down', async () => {
    const { getByTestId } = render(
      <AmountInput value={0.123} decimalPrecision={3} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    userEvent.type(amountInput, '1112');

    await waitFor(() => expect(amountInput).toHaveValue(0.123));
  });

  test('correctly formats a value when rounding up', async () => {
    const { getByTestId } = render(
      <AmountInput value={0.123} decimalPrecision={3} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    userEvent.type(amountInput, '5556');

    await waitFor(() => expect(amountInput).toHaveValue(0.124));
  });

  test('allows value changes', () => {
    const { getByTestId } = render(
      <AmountInput value="2" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(2);

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue(4);
  });

  test('does not allow value changes if it is readonly', () => {
    const { getByTestId } = render(
      <AmountInput value="2" readOnly dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue(2);

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue(2);
  });

  test('does not allow value changes if it is disabled', () => {
    const { getByTestId } = render(
      <AmountInput value="2" disabled dataAttribute="test" />,
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
      <AmountInput value="2.4" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveProperty('lang', 'sk-SK');
  });

  test('does not allow to enter more than 9 whole numbers', async () => {
    const { getByTestId } = render(
      <AmountInput value={2} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '10000000000000');

    await waitFor(() => expect(amountInput).toHaveValue(999999999));
  });

  test('trims unnecessary zeros at the end', async () => {
    const { getByTestId } = render(
      <AmountInput
        value="0.065000"
        decimalPrecision={6}
        dataAttribute="test"
      />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue(0.065);
  });

  test('does not allow to enter more than max amount value', async () => {
    const { getByTestId } = render(
      <AmountInput value={12} maxAmount={10} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue(10);
  });

  test('does not allow to enter less than min amount value', async () => {
    const { getByTestId } = render(
      <AmountInput value={3} min={4.56} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue(4.56);
  });

  test('does not round to max value if max amount is less than the max value', async () => {
    const { getByTestId } = render(
      <AmountInput
        value={999999994}
        maxAmount={999999990}
        dataAttribute="test"
      />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue(999999990);
  });
});
