import { render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

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
jest.mock('../../../../hooks/exitFee/useZeroExitFee', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return {
    useZeroExitFee: () => ({
      active: true,
      rateBps: 50,
      feeAmount: ActualDecimal.ZERO,
      netAmount: ActualDecimal.ZERO,
      loading: false,
    }),
  };
});

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

  it('shows the "You will receive" row when withdrawing collateral', () => {
    render(<FormContent {...makeProps()} />);
    expect(screen.getByText('You will receive')).toBeInTheDocument();
    // "Perimeter fee" only lives inside the (closed) tooltip, not as a row label.
    expect(screen.queryByText(/^Perimeter fee/)).not.toBeInTheDocument();
  });

  it('hides the "You will receive" row when adding collateral', () => {
    render(<FormContent {...makeProps({ collateralType: AmountType.Add })} />);
    expect(screen.queryByText('You will receive')).not.toBeInTheDocument();
  });
});
