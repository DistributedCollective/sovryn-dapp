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

  it('covers Zero closeTrove() (ZUSD), measured 588,995 gas (rskForkedMainnetQa, delay 120s, tx 0xa88b4522443397efbdee69a63f2297ba9f354f85597c9399cb488abb755f7ddf)', () => {
    expect(GAS_LIMIT.CLOSE_TROVE).toBeGreaterThanOrEqual(
      Math.ceil(588_995 * 1.3),
    );
  });

  it('covers Zero closeNueTroveWithPermit2() (DLLR), measured 745,682 gas (rskForkedMainnetQa, delay 120s, tx 0x4556ddca29569bf88b536e04e22680dc895eb400d0ef5943b52c1ca4ec7c2a7d)', () => {
    expect(GAS_LIMIT.CLOSE_DLLR_TROVE).toBeGreaterThanOrEqual(
      Math.ceil(745_682 * 1.3),
    );
  });

  it('covers Zero claimCollateral() (the surplus claim), measured 386,192 gas (rskForkedMainnetQa, delay 120s, tx 0xee909088e754c220b6be96c143b29828cf20950bc445ea4871e19a629408c20b)', () => {
    expect(GAS_LIMIT.CLAIM_SURPLUS).toBeGreaterThanOrEqual(
      Math.ceil(386_192 * 1.3),
    );
  });

  it('covers the lending burnToBTC() withdrawal, measured 601,556 gas with the withdrawal delay armed', () => {
    expect(GAS_LIMIT.LENDING_BURN).toBeGreaterThanOrEqual(
      Math.ceil(601_556 * 1.3),
    );
  });
});
