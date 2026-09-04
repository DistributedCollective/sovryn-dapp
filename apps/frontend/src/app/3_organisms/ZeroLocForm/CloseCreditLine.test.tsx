import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../locales/i18n';
import { CloseCreditLine } from './CloseCreditLine';

const mockQuote = {
  active: true,
  rateBps: 50,
  feeAmount: Decimal.from('0.002'),
  netAmount: Decimal.from('0.398'),
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

jest.mock('../../../hooks/exitFee/useZeroExitFee', () => ({
  useZeroExitFee: () => mockQuote,
}));

jest.mock('./hooks/useZeroData', () => ({
  useZeroData: () => ({ isRecoveryMode: false }),
}));

jest.mock('../../../hooks/useMaintenance', () => ({
  useMaintenance: () => ({ checkMaintenance: () => false, States: {} }),
}));

jest.mock('../../../hooks/useAssetBalance', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return {
    useAssetBalance: () => ({ balance: ActualDecimal.from(10000) }),
  };
});

describe('CloseCreditLine perimeter fee', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('shows the NET collateral to receive with a fee tooltip', () => {
    const { container } = render(
      <CloseCreditLine
        collateralValue={Decimal.from('0.4')}
        creditValue={Decimal.from(3000)}
        onSubmit={jest.fn()}
        rbtcPrice={Decimal.from(67000)}
      />,
    );
    expect(screen.getByText('Collateral to receive')).toBeInTheDocument();
    expect(screen.getByText(/0\.398/)).toBeInTheDocument();
    expect(screen.queryByText(/^0\.4 /)).not.toBeInTheDocument();

    // "Perimeter fee" only lives inside the (closed) tooltip, not as a row label.
    expect(screen.queryByText(/^Perimeter fee/)).not.toBeInTheDocument();
    const helperIcon = container.querySelector(
      '[data-layout-id="exit-fee-helper"]',
    );
    expect(helperIcon).toBeInTheDocument();

    fireEvent.click(helperIcon as Element);
    expect(screen.getByText(/Perimeter fee \(0\.5%\)/)).toBeInTheDocument();
  });

  it('shows the gross with no helper icon when the fee is inactive', () => {
    Object.assign(mockQuote, { active: false, rateBps: 0 });
    const { container } = render(
      <CloseCreditLine
        collateralValue={Decimal.from('0.4')}
        creditValue={Decimal.from(3000)}
        onSubmit={jest.fn()}
        rbtcPrice={Decimal.from(67000)}
      />,
    );
    expect(screen.queryByText(/Perimeter fee/)).not.toBeInTheDocument();
    expect(screen.getByText(/0\.4/)).toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-fee-helper"]'),
    ).not.toBeInTheDocument();
  });
});
