import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { getBorrowerExitFeeGross } from './BorrowPage.utils';

jest.mock('nanoid', () => {
  return { nanoid: () => '1234' };
});

const base = {
  isCloseTab: false,
  isRepayTab: false,
  isCollateralWithdrawTab: false,
  loanCollateral: Decimal.from(10),
  collateralSize: Decimal.from(2),
  collateralWithdrawn: Decimal.from(3),
  debtSize: Decimal.from(500),
  maximumRepayAmount: Decimal.from(1000),
};

describe('getBorrowerExitFeeGross', () => {
  it('close tab returns the full collateral', () => {
    expect(
      getBorrowerExitFeeGross({ ...base, isCloseTab: true }).toString(),
    ).toEqual('10');
  });

  it('repay tab returns the proportional withdrawal', () => {
    expect(
      getBorrowerExitFeeGross({ ...base, isRepayTab: true }).toString(),
    ).toEqual('3');
  });

  it('full repay returns the full collateral', () => {
    expect(
      getBorrowerExitFeeGross({
        ...base,
        isRepayTab: true,
        debtSize: Decimal.from(1000),
      }).toString(),
    ).toEqual('10');
  });

  it('repay tab with zero debt input returns zero', () => {
    expect(
      getBorrowerExitFeeGross({
        ...base,
        isRepayTab: true,
        debtSize: Decimal.ZERO,
      }).isZero(),
    ).toBe(true);
  });

  it('withdraw-collateral tab returns the entered amount', () => {
    expect(
      getBorrowerExitFeeGross({
        ...base,
        isCollateralWithdrawTab: true,
      }).toString(),
    ).toEqual('2');
  });

  it('borrow/add tabs return zero', () => {
    expect(getBorrowerExitFeeGross(base).isZero()).toBe(true);
  });

  it('close tab wins over simultaneous collateral-withdraw tab', () => {
    expect(
      getBorrowerExitFeeGross({
        ...base,
        isCloseTab: true,
        isCollateralWithdrawTab: true,
      }).toString(),
    ).toEqual('10');
  });

  it('repay tab wins over simultaneous collateral-withdraw tab', () => {
    expect(
      getBorrowerExitFeeGross({
        ...base,
        isRepayTab: true,
        isCollateralWithdrawTab: true,
      }).toString(),
    ).toEqual('3');
  });
});
