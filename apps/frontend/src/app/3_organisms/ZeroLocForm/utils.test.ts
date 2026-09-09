import 'jest-canvas-mock';

import { isCollateralWithdrawal } from './utils';

/**
 * `withdrawCollateral` reaches the submit handler as the raw input string. The
 * post-signature hold notice is gated on it, and a string test disagreed with
 * the form's own row: a repay that moved no collateral announced that the
 * holder's funds had gone to the Perimeter vault.
 */
describe('isCollateralWithdrawal', () => {
  it('is true only for an amount that actually leaves', () => {
    expect(isCollateralWithdrawal('0.5')).toBe(true);
    expect(isCollateralWithdrawal('0.00000001')).toBe(true);
  });

  it('is false for a field that was typed into and cleared', () => {
    // Truthy strings that are not '0', reachable by typing a digit and
    // deleting it.
    expect(isCollateralWithdrawal('0.0')).toBe(false);
    expect(isCollateralWithdrawal('0.00')).toBe(false);
    expect(isCollateralWithdrawal('0.')).toBe(false);
  });

  it('is false for an adjust that carries no collateral leg at all', () => {
    expect(isCollateralWithdrawal('0')).toBe(false);
    expect(isCollateralWithdrawal('')).toBe(false);
    expect(isCollateralWithdrawal(undefined)).toBe(false);
  });
});
