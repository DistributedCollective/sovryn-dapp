import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

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

let mockDelay: { delaySeconds: number; loading: boolean; unknown: boolean };

jest.mock('../../../hooks/exitDelay/useZeroExitDelayQuote', () => ({
  useZeroExitDelayQuote: () => mockDelay,
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

  beforeEach(() => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };
  });

  // The hold row links to the Perimeter page, so the form needs a router the
  // way it has one in the app.
  const renderForm = () =>
    render(
      <MemoryRouter>
        <CloseCreditLine
          collateralValue={Decimal.from('0.4')}
          creditValue={Decimal.from(3000)}
          onSubmit={jest.fn()}
          rbtcPrice={Decimal.from(67000)}
        />
      </MemoryRouter>,
    );

  it('shows the NET collateral to receive with a fee tooltip', () => {
    const { container } = renderForm();
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
    const { container } = renderForm();
    expect(screen.queryByText(/Perimeter fee/)).not.toBeInTheDocument();
    expect(screen.getByText(/0\.4/)).toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-fee-helper"]'),
    ).not.toBeInTheDocument();
  });

  it('tells the borrower the collateral will be held, and for how long', () => {
    // A close always returns collateral, so the hold applies unconditionally.
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    renderForm();

    expect(screen.getByText('Withdrawal delay')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
  });

  it('admits it could not check whether the collateral will be held', () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: true };

    renderForm();

    expect(screen.getByText('Could not be checked')).toBeInTheDocument();
  });

  describe('Confirm and the delay quote', () => {
    const confirm = (container: HTMLElement) =>
      container.querySelector('[data-layout-id="close-credit-line-confirm"]');

    it('waits for the delay quote, and says it is checking', () => {
      // The close form is prefilled: without this, Confirm is live before a
      // single delay read has returned.
      mockDelay = { delaySeconds: 0, loading: true, unknown: false };

      const { container } = renderForm();

      expect(screen.getByText(/^Checking/)).toBeInTheDocument();
      expect(confirm(container)).toBeDisabled();
    });

    it('offers Confirm once a quote arrived', () => {
      mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

      const { container } = renderForm();

      expect(confirm(container)).toBeEnabled();
    });

    it('offers Confirm when the quote could not be read', () => {
      mockDelay = { delaySeconds: 0, loading: false, unknown: true };

      const { container } = renderForm();

      expect(confirm(container)).toBeEnabled();
    });
  });
});
