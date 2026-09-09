import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { BigNumber } from 'ethers';
import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../../../locales/i18n';
import { asyncCall } from '../../../../../store/rxjs/provider-cache';
import { LendingForm } from './LendingForm';

jest.mock('nanoid', () => {
  return { nanoid: () => '1234' };
});

jest.mock('../../../../../contexts/NotificationContext', () => {
  return {
    useNotificationContext: () => ({
      addNotification: jest.fn(),
    }),
  };
});

jest.mock('../../../../../hooks/exitFee/useExitFeeRate', () => ({
  useExitFeeRate: () => ({ active: true, rateBps: 50, loading: false }),
}));

let mockDelay: { delaySeconds: number; loading: boolean; unknown: boolean };

jest.mock('../../../../../hooks/exitDelay/useExitDelayQuote', () => ({
  useExitDelayQuote: () => mockDelay,
}));

jest.mock('../../../../../hooks/useMaxAssetBalance', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return {
    useMaxAssetBalance: () => ({ balance: ActualDecimal.from(1000) }),
  };
});

// note: react-scripts' jest preset sets `resetMocks: true`, which strips any
// mockResolvedValue configured inline here before every test runs — so
// `asyncCall` is reconfigured fresh in `beforeEach` below instead.
jest.mock('../../../../../store/rxjs/provider-cache', () => ({
  ...jest.requireActual('../../../../../store/rxjs/provider-cache'),
  asyncCall: jest.fn(),
}));

const state = {
  token: 'dllr',
  tokenDetails: { symbol: 'dllr' },
  poolTokenContract: { address: '0x0000000000000000000000000000000000000001' },
  balance: Decimal.from(5000),
  liquidity: Decimal.from(100000),
  apr: Decimal.from(2),
} as any;

describe('LendingForm perimeter fee', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    (asyncCall as jest.Mock).mockResolvedValue(BigNumber.from(0));
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };
  });

  // The hold row links to the Perimeter page, so the form needs a router the
  // way it has one in the app.
  const renderForm = () =>
    render(
      <MemoryRouter>
        <LendingForm state={state} onConfirm={jest.fn()} />
      </MemoryRouter>,
    );

  /** Enter an amount on the withdraw tab, the way a lender would. */
  const withdraw = (amount = '100') => {
    renderForm();
    fireEvent.click(screen.getByText('Withdraw'));
    const input = screen.getByPlaceholderText('0');
    fireEvent.change(input, { target: { value: amount } });
    fireEvent.blur(input);
  };

  it('shows the "You will receive" row on the withdraw tab once an amount is entered', () => {
    renderForm();
    fireEvent.click(screen.getByText('Withdraw'));
    const input = screen.getByPlaceholderText('0');
    fireEvent.change(input, { target: { value: '100' } });
    // AmountInput/InputBase debounces onChangeText (default 500ms) for the
    // "change" event; blur commits the value synchronously (type="number"
    // path in InputBase.handleOnBlur), which is what the parent's `amount`
    // state (and therefore ExitFeeRow) reacts to.
    fireEvent.blur(input);
    expect(screen.getByText('You will receive')).toBeInTheDocument();
    // "Perimeter fee" only lives inside the (closed) tooltip, not as a row label.
    expect(screen.queryByText(/^Perimeter fee/)).not.toBeInTheDocument();
  });

  it('tells the lender the withdrawal will be held, and for how long', () => {
    // No test in this repo used to render a form with a real hold, so the row
    // could have stopped appearing without anything failing.
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    withdraw();

    expect(screen.getByText('Withdrawal hold')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
    expect(screen.getByText(/Perimeter vault/)).toBeInTheDocument();
  });

  it('admits it could not check whether the withdrawal will be held', () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: true };

    withdraw();

    expect(screen.getByText('Could not be checked')).toBeInTheDocument();
  });

  it('shows no hold on the deposit tab, however long the hold would be', () => {
    // Nothing leaves on a deposit, so nothing is held.
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    renderForm();
    const input = screen.getByPlaceholderText('0');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.blur(input);

    expect(screen.queryByText('Withdrawal hold')).not.toBeInTheDocument();
  });

  it('shows no "You will receive" row on the deposit tab', () => {
    renderForm();
    const input = screen.getByPlaceholderText('0');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.blur(input);
    expect(screen.queryByText('You will receive')).not.toBeInTheDocument();
  });
});
