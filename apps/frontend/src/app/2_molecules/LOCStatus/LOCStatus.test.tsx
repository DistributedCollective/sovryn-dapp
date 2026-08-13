import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../locales/i18n';
import { LOCStatus } from './LOCStatus';

const mockRate = {
  active: true,
  rateBps: 50,
  loading: false,
};

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

jest.mock('../../../hooks/exitFee/useExitFeeRate', () => ({
  useExitFeeRate: () => mockRate,
}));

describe('LOCStatus perimeter fee', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    Object.assign(mockRate, { active: true, rateBps: 50, loading: false });
  });

  it('shows the NET surplus with a fee tooltip when the fee is active', () => {
    const { container } = render(
      <LOCStatus
        withdrawalSurplus={Decimal.from('0.4')}
        collateral={Decimal.ZERO}
        debt={Decimal.ZERO}
        onWithdraw={jest.fn()}
      />,
    );

    expect(screen.getByText(/0\.398/)).toBeInTheDocument();
    expect(screen.queryByText(/^0\.4 /)).not.toBeInTheDocument();
    // "Perimeter fee" only lives inside the (closed) tooltip, not inline.
    expect(screen.queryByText(/^Perimeter fee/)).not.toBeInTheDocument();

    const helperIcon = container.querySelector(
      '[data-layout-id="exit-fee-helper"]',
    );
    expect(helperIcon).toBeInTheDocument();

    fireEvent.click(helperIcon as Element);
    expect(screen.getByText(/Perimeter fee \(0\.5%\)/)).toBeInTheDocument();
  });

  it('shows the gross surplus with no helper icon when the fee is inactive', () => {
    Object.assign(mockRate, { active: false, rateBps: 0 });

    const { container } = render(
      <LOCStatus
        withdrawalSurplus={Decimal.from('0.4')}
        collateral={Decimal.ZERO}
        debt={Decimal.ZERO}
        onWithdraw={jest.fn()}
      />,
    );

    expect(screen.getByText('0.4 BTC')).toBeInTheDocument();
    expect(screen.queryByText(/Perimeter fee/)).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-fee-helper"]'),
    ).not.toBeInTheDocument();
  });

  it('does not render the surplus stat at all when there is no surplus', () => {
    render(
      <LOCStatus
        withdrawalSurplus={Decimal.ZERO}
        collateral={Decimal.ZERO}
        debt={Decimal.ZERO}
        onWithdraw={jest.fn()}
      />,
    );

    expect(screen.queryByText('withdrawal surplus')).not.toBeInTheDocument();
  });
});
