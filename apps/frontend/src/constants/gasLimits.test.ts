import { GAS_LIMIT } from './gasLimits';

/**
 * Every Perimeter-hooked withdrawal surface's fallback floor must cover its
 * own measured delay-armed cost plus the same 30% margin resolveGasLimit
 * applies to a live estimate (TransactionStepDialog/utils.ts). The floor is
 * what protects a user when that live estimate fails — a floor sized only
 * for the plain, delay-off call is not enough, because it cannot rely on
 * the margin to rescue an estimate that never ran. Each assertion cites the
 * transaction the number was measured from.
 */
describe('GAS_LIMIT delay-armed floors', () => {
  it('covers the fixed-interest borrower withdraw-collateral, measured 448,331 gas (rskForkedMainnetQa, delay 120s, tx 0x18da6c0d5f93b52528f2e0adad7f8ee3022a95d4c8147e071e1c926d3671114d)', () => {
    expect(GAS_LIMIT.WITHDRAW_LOAN_COLLATERAL).toBeGreaterThanOrEqual(
      Math.ceil(448_331 * 1.3),
    );
  });
});
