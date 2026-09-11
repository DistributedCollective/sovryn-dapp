import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../../../locales/i18n';

// The form's tab labels are translated at module load, so the module has to be
// required only once i18n has resolved — in the app it always is.
let AdjustLoanForm: typeof import('./AdjustLoanForm').AdjustLoanForm;

/**
 * This form had no test at all, and it is the one place where the hold row is
 * gated on a computed gross rather than on a tab: the row must appear for a
 * collateral withdrawal and stay away from a borrow or an add-collateral
 * adjust, which take nothing out of the protocol.
 */

let mockDelay: { delaySeconds: number; loading: boolean; unknown: boolean };

// The real submit hooks return the submit function itself, so these do too.
const mockHandleRepay = jest.fn();
const mockHandleBorrow = jest.fn();
const mockHandleWithdrawCollateral = jest.fn();
const mockHandleDepositCollateral = jest.fn();

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('../../../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: jest.fn() }),
}));

jest.mock('../../../../../hooks/exitDelay/useExitDelayQuote', () => ({
  useExitDelayQuote: () => mockDelay,
}));

jest.mock('../../../../../hooks/exitFee/useExitFeeRate', () => ({
  useExitFeeRate: () => ({
    active: true,
    rateBps: 10,
    unknown: false,
    loading: false,
  }),
}));

jest.mock('../../../../../hooks/useLoadContract', () => ({
  useLoadContract: () => ({
    address: '0x0000000000000000000000000000000000000001',
  }),
}));

jest.mock('../../../../../hooks/useQueryRate', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useQueryRate: () => [ActualDecimal.from(67000)] };
});

jest.mock('../../../../../hooks/useMaxAssetBalance', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useMaxAssetBalance: () => ({ balance: ActualDecimal.from(1000) }) };
});

jest.mock('../../hooks/useGetBorrowingAPR', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useGetBorrowingAPR: () => ({ borrowApr: ActualDecimal.from(5) }) };
});

jest.mock('../../hooks/useGetMaintenanceStates', () => ({
  useGetMaintenanceStates: () => ({
    checkMaintenance: () => false,
    borrowLocked: false,
    repayLocked: false,
    closeLocked: false,
    addCollateralLocked: false,
    withdrawCollateralLocked: false,
  }),
}));

jest.mock('../../hooks/useGetOriginationFee', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useGetOriginationFee: () => ActualDecimal.from(0.01) };
});

jest.mock('../../hooks/useGetMinCollateralRatio', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useGetMinCollateralRatio: () => ActualDecimal.from(1.5) };
});

jest.mock('../NewLoanForm/hooks/useBorrow', () => ({
  useBorrow: () => mockHandleBorrow,
}));

jest.mock('../NewLoanForm/hooks/useGetMaximumCollateralAmount', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return {
    useGetMaximumCollateralAmount: () => ({
      maximumCollateralAmount: ActualDecimal.from(1),
      loading: false,
    }),
  };
});

jest.mock('./hooks/useCloseWithDepositIsTinyPosition', () => ({
  useCloseWithDepositIsTinyPosition: () => jest.fn(),
}));

jest.mock('./hooks/useDepositCollateral', () => ({
  useDepositCollateral: () => mockHandleDepositCollateral,
}));

jest.mock('./hooks/useDrawdown', () => ({
  useDrawdown: () => ({ handleSubmit: jest.fn() }),
}));

jest.mock('./hooks/useGetInterestRefund', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useGetInterestRefund: () => ActualDecimal.ZERO };
});

jest.mock('./hooks/useGetMaxCollateralWithdrawal', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useGetMaxCollateralWithdrawal: () => ActualDecimal.from(0.2) };
});

jest.mock('./hooks/useGetMaxRepayAmount', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return {
    useGetMaxRepayAmount: () => ({
      maximumRepayAmount: ActualDecimal.from(3000),
      maximumAvailableRepayAmount: ActualDecimal.from(3000),
    }),
  };
});

jest.mock('./hooks/useGetMaximumBorrowAmount', () => {
  const { Decimal: ActualDecimal } = jest.requireActual('@sovryn/utils');
  return { useGetMaximumBorrowAmount: () => ActualDecimal.from(1000) };
});

jest.mock('./hooks/useRepayLoan', () => ({
  useRepayLoan: () => mockHandleRepay,
}));

jest.mock('./hooks/useWithdrawCollateral', () => ({
  useWithdrawCollateral: () => mockHandleWithdrawCollateral,
}));

const loan = {
  id: '0xloan',
  debt: 3000,
  debtAsset: 'zusd',
  collateral: 0.4,
  collateralAsset: 'btc',
  collateralRatio: 200,
  liquidationPrice: 40000,
  apr: '5',
  rolloverDate: 1_800_000_000,
  interestOwedPerDay: 0.1,
  startMargin: Decimal.from(200),
  currentMargin: Decimal.from(180),
  maintenanceMargin: Decimal.from(15),
} as any;

const HOLD = { delaySeconds: 172800, loading: false, unknown: false };

const renderForm = () =>
  render(
    <MemoryRouter>
      <AdjustLoanForm loan={loan} />
    </MemoryRouter>,
  );

/** Enter an amount into the collateral input, the way a borrower would. */
const enterCollateral = (amount: string) => {
  const inputs = screen.getAllByPlaceholderText('0');
  const collateralInput = inputs[inputs.length - 1];
  fireEvent.change(collateralInput, { target: { value: amount } });
  fireEvent.blur(collateralInput);
};

describe('AdjustLoanForm perimeter hold', () => {
  beforeAll(async () => {
    await i18n;
    AdjustLoanForm = require('./AdjustLoanForm').AdjustLoanForm;
  });

  beforeEach(() => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: false };
  });

  it('shows no hold for an adjust that takes nothing out', () => {
    // The default tabs are Borrow and Add collateral: nothing leaves the
    // protocol, so nothing can be held however long the hold would be.
    mockDelay = HOLD;

    renderForm();

    expect(screen.queryByText('Withdrawal hold')).not.toBeInTheDocument();
  });

  it('tells the borrower a collateral withdrawal will be held', () => {
    mockDelay = HOLD;

    renderForm();
    fireEvent.click(screen.getByText('Withdraw collateral'));
    enterCollateral('0.1');

    expect(screen.getByText('Withdrawal hold')).toBeInTheDocument();
    expect(screen.getByText('2 days')).toBeInTheDocument();
  });

  it('admits it could not check whether the withdrawal will be held', () => {
    mockDelay = { delaySeconds: 0, loading: false, unknown: true };

    renderForm();
    fireEvent.click(screen.getByText('Withdraw collateral'));
    enterCollateral('0.1');

    expect(screen.getByText('Could not be checked')).toBeInTheDocument();
  });

  it('shows no hold when a quote arrived saying nothing is held', () => {
    renderForm();
    fireEvent.click(screen.getByText('Withdraw collateral'));
    enterCollateral('0.1');

    expect(screen.queryByText('Withdrawal hold')).not.toBeInTheDocument();
    expect(screen.queryByText('Could not be checked')).not.toBeInTheDocument();
  });

  describe('Confirm and the delay quote', () => {
    const confirm = () =>
      document.querySelector(
        '[data-layout-id="adjust-loan-confirm-button"]',
      ) as HTMLButtonElement;

    const withdrawCollateral = () => {
      renderForm();
      fireEvent.click(screen.getByText('Withdraw collateral'));
      enterCollateral('0.1');
    };

    it('waits for the delay quote on a collateral withdrawal, and says it is checking', () => {
      mockDelay = { delaySeconds: 0, loading: true, unknown: false };

      withdrawCollateral();

      expect(screen.getByText(/^Checking/)).toBeInTheDocument();
      expect(confirm()).toBeDisabled();
    });

    it('offers Confirm once a quote arrived, and hands the post-signature notice to the withdrawal', () => {
      mockDelay = HOLD;

      withdrawCollateral();
      expect(confirm()).toBeEnabled();
      fireEvent.click(confirm());

      expect(mockHandleWithdrawCollateral).toHaveBeenCalledWith(
        '0.1',
        loan.id,
        expect.any(Function),
      );
    });

    it('offers Confirm when the quote could not be read', () => {
      mockDelay = { delaySeconds: 0, loading: false, unknown: true };

      withdrawCollateral();

      expect(confirm()).toBeEnabled();
    });
  });
});
