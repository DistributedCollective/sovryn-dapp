import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';

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
  });

  it('shows the "You will receive" row on the withdraw tab once an amount is entered', () => {
    render(<LendingForm state={state} onConfirm={jest.fn()} />);
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

  it('shows no "You will receive" row on the deposit tab', () => {
    render(<LendingForm state={state} onConfirm={jest.fn()} />);
    const input = screen.getByPlaceholderText('0');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.blur(input);
    expect(screen.queryByText('You will receive')).not.toBeInTheDocument();
  });
});
