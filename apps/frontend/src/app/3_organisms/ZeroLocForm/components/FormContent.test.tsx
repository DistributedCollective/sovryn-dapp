import { render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../../locales/i18n';
import { AmountType } from '../types';
import { FormContent } from './FormContent';

jest.mock('nanoid', () => {
  return { nanoid: () => '1234' };
});

jest.mock('../../../../contexts/NotificationContext', () => {
  return {
    useNotificationContext: () => ({
      addNotification: jest.fn(),
    }),
  };
});

// react-scripts' jest preset hoists jest.mock() calls above imports, so the
// factory can't close over the top-level `Decimal` import directly — pull it
// via requireActual instead (same pattern as LendingForm.test.tsx).
let mockDelay: { delaySeconds: number; loading: boolean; unknown: boolean };
let mockFee: {
  active: boolean;
  rateBps: number;
  feeAmount: Decimal;
  netAmount: Decimal;
  loading: boolean;
};

jest.mock('../../../../hooks/exitDelay/useZeroExitDelayQuote', () => ({
  useZeroExitDelayQuote: () => mockDelay,
}));

jest.mock('../../../../hooks/exitFee/useZeroExitFee', () => ({
  useZeroExitFee: () => mockFee,
}));

jest.mock('../../../../hooks/useMaintenance', () => ({
  useMaintenance: () => ({
    checkMaintenance: () => false,
    States: {},
  }),
}));

jest.mock('../../../5_pages/ZeroPage/hooks/useLiquityBaseParams', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return {
    useLiquityBaseParams: () => ({
      minBorrowingFeeRate: ActualDecimal.ZERO,
      maxBorrowingFeeRate: ActualDecimal.from(0.05),
    }),
  };
});

const makeProps = (overrides: object = {}) =>
  ({
    hasTrove: true,
    existingDebt: Decimal.from(3000),
    existingCollateral: Decimal.from(0.4),
    debtType: AmountType.Add,
    onDebtTypeChange: jest.fn(),
    collateralType: AmountType.Remove,
    onCollateralTypeChange: jest.fn(),
    rbtcPrice: Decimal.from(67000),
    borrowingRate: Decimal.ZERO,
    originationFee: Decimal.ZERO,
    maxOriginationFeeRate: '5',
    onMaxOriginationFeeRateChange: jest.fn(),
    debtAmount: '0',
    maxDebtAmount: Decimal.from(1000),
    onDebtAmountChange: jest.fn(),
    debtToken: 'zusd',
    onDebtTokenChange: jest.fn(),
    collateralAmount: '0.02',
    maxCollateralAmount: Decimal.from(0.2),
    onCollateralAmountChange: jest.fn(),
    initialRatio: Decimal.from(200),
    currentRatio: Decimal.from(180),
    initialLiquidationPrice: Decimal.from(40000),
    liquidationPrice: Decimal.from(45000),
    initialLiquidationPriceInRecoveryMode: Decimal.from(50000),
    liquidationPriceInRecoveryMode: Decimal.from(55000),
    totalDebt: Decimal.from(3000),
    totalCollateral: Decimal.from(0.38),
    onFormSubmit: jest.fn(),
    ...overrides,
  } as any);

describe('FormContent perimeter fee', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };
    mockFee = {
      active: true,
      rateBps: 50,
      feeAmount: Decimal.ZERO,
      netAmount: Decimal.ZERO,
      loading: false,
    };
  });

  // The hold row links to the Perimeter page, so the form needs a router the
  // way it has one in the app.
  const renderForm = (overrides: object = {}) =>
    render(
      <MemoryRouter>
        <FormContent {...makeProps(overrides)} />
      </MemoryRouter>,
    );

  it('shows the "You will receive" row when withdrawing collateral', () => {
    renderForm();
    expect(screen.getByText('You will receive')).toBeInTheDocument();
    // "Perimeter fee" only lives inside the (closed) tooltip, not as a row label.
    expect(screen.queryByText(/^Perimeter fee/)).not.toBeInTheDocument();
  });

  it('hides the "You will receive" row when adding collateral', () => {
    renderForm({ collateralType: AmountType.Add });
    expect(screen.queryByText('You will receive')).not.toBeInTheDocument();
  });

  it('tells the borrower the collateral will be held, and for how long', () => {
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    renderForm();

    expect(screen.getByText('Withdrawal delay')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
  });

  it('shows no hold for an adjust that removes no collateral', () => {
    // A borrow or an add-collateral adjust takes nothing out, so the perimeter
    // holds nothing back however long a hold it would impose on a withdrawal.
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    renderForm({ collateralType: AmountType.Add });

    expect(screen.queryByText('Withdrawal delay')).not.toBeInTheDocument();
  });

  it('shows no hold for a debt-only adjust', () => {
    mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

    // A collateral field typed into and cleared leaves a truthy '0.0'.
    renderForm({ collateralAmount: '0.0' });

    expect(screen.queryByText('Withdrawal delay')).not.toBeInTheDocument();
  });

  it('admits it could not check whether the collateral will be held', () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: true };

    renderForm();

    expect(screen.getByText('Could not be checked')).toBeInTheDocument();
  });

  describe('Confirm and the delay quote', () => {
    const confirm = (container: HTMLElement) =>
      container.querySelector(
        '[data-layout-id="adjust-credit-line-confirm-button"]',
      );

    it('waits for the delay quote on a collateral withdrawal, and says it is checking', () => {
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

    it('does not hold an adjust that removes no collateral back for the quote', () => {
      mockDelay = { delaySeconds: 0, loading: true, unknown: false };

      const { container } = renderForm({ collateralType: AmountType.Add });

      expect(confirm(container)).toBeEnabled();
    });
  });

  describe('Confirm and the fee quote', () => {
    const confirm = (container: HTMLElement) =>
      container.querySelector(
        '[data-layout-id="adjust-credit-line-confirm-button"]',
      );

    it('waits for the fee quote on a collateral withdrawal even once the delay has settled', () => {
      mockFee.loading = true;

      const { container } = renderForm();

      expect(confirm(container)).toBeDisabled();
    });

    it('offers Confirm once the fee quote has settled', () => {
      mockFee.loading = false;

      const { container } = renderForm();

      expect(confirm(container)).toBeEnabled();
    });

    it('does not hold an adjust that removes no collateral back for the fee quote', () => {
      mockFee.loading = true;

      const { container } = renderForm({ collateralType: AmountType.Add });

      expect(confirm(container)).toBeEnabled();
    });
  });
});
