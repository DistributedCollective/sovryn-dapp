import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { act } from 'react-dom/test-utils';

import { AmountInput } from './AmountInput';

let languageGetter;

beforeEach(() => {
  languageGetter = jest.spyOn(window.navigator, 'language', 'get');
  // use en-US as default language for tests
  languageGetter.mockReturnValue('en-US');
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
    expect(amountInput).toHaveValue('0.123');
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
    expect(amountInput).toHaveValue('0.123');
  });

  test('allows value changes', () => {
    const { getByTestId } = render(
      <AmountInput value="2" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue('2');

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue('4');
  });

  test('does not allow value changes if it is readonly', () => {
    const { getByTestId } = render(
      <AmountInput value="2" readOnly dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue('2');

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue('2');
  });

  test('does not allow value changes if it is disabled', () => {
    const { getByTestId } = render(
      <AmountInput value="2" disabled dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveValue('2');

    userEvent.clear(amountInput);
    userEvent.paste(amountInput, '4');
    expect(amountInput).toHaveValue('2');
  });

  test('sets up localization', () => {
    languageGetter.mockReturnValue('sk-SK');

    const { getByTestId } = render(
      <AmountInput value="2.4" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');
    expect(amountInput).toHaveProperty('lang', 'sk-SK');
  });

  test('trims unnecessary zeros at the end on blur', async () => {
    const { getByTestId } = render(
      <AmountInput
        value="0.065000"
        decimalPrecision={6}
        dataAttribute="test"
      />,
    );

    const amountInput = getByTestId('test');

    act(() => {
      amountInput.focus();
      amountInput.blur();
    });

    expect(amountInput).toHaveValue('0.065');
  });

  test('does allow to enter more than max amount value if useAmountButtons prop is not set', async () => {
    const { getByTestId } = render(
      <AmountInput value={12} maxAmount={10} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue('12');
  });

  test('does not allow to enter more than max amount value when useAmountButtons prop is set', async () => {
    const { getByTestId } = render(
      <AmountInput
        value={12}
        maxAmount={10}
        dataAttribute="test"
        useAmountButtons
      />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue('10');
  });

  test('does not allow to enter less than min amount value', async () => {
    const { getByTestId } = render(
      <AmountInput value={3} min={4.56} dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue('4.56');
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

    expect(amountInput).toHaveValue('999999994');
  });

  test('allows to enter 18 decimals if the integer part length is less than 9', async () => {
    const { getByTestId } = render(
      <AmountInput value="1.123456789123456789" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue('1.123456789123456789');
  });

  test('allows to enter 9 integers and 18 decimals', async () => {
    const { getByTestId } = render(
      <AmountInput value="999999999.123456789123456789" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue('999999999.123456789123456789');
  });

  test('does not allow to enter more than 18 decimals', async () => {
    const { getByTestId } = render(
      <AmountInput value="3.12345678912345678912" dataAttribute="test" />,
    );

    const amountInput = getByTestId('test');

    expect(amountInput).toHaveValue('3.123456789123456789');
  });
});
