import { utils } from 'ethers';

import { Decimal } from '@sovryn/utils';

import {
  EXIT_FEE_MAX_BPS,
  SURFACE_LENDING_BORROWER_WITHDRAW,
  SURFACE_LENDING_LENDER_WITHDRAW,
  SURFACE_ZERO_CLAIM_SURPLUS,
  SURFACE_ZERO_WITHDRAW_COLL,
  getExitFeeAmount,
  getExitFeeNet,
  isExitFeeShown,
} from './exitFee';

describe('exitFee utils', () => {
  it('surface ids match keccak256 of the registry preimages', () => {
    expect(SURFACE_LENDING_LENDER_WITHDRAW).toEqual(
      utils.id('PERIMETER_SURFACE_LENDING_LENDER_WITHDRAW'),
    );
    expect(SURFACE_LENDING_BORROWER_WITHDRAW).toEqual(
      utils.id('PERIMETER_SURFACE_LENDING_BORROWER_WITHDRAW'),
    );
    expect(SURFACE_ZERO_WITHDRAW_COLL).toEqual(
      utils.id('PERIMETER_SURFACE_ZERO_WITHDRAW_COLL'),
    );
    expect(SURFACE_ZERO_CLAIM_SURPLUS).toEqual(
      utils.id('PERIMETER_SURFACE_ZERO_CLAIM_SURPLUS'),
    );
    // Pin the literals too. The preimage assertions above cannot catch a
    // rename that rewrites the constant and its own expectation together —
    // which is exactly how a stale `COLFEE:` prefix survived once.
    expect(SURFACE_LENDING_LENDER_WITHDRAW).toEqual(
      '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe',
    );
    expect(SURFACE_LENDING_BORROWER_WITHDRAW).toEqual(
      '0xfa502ea562018a194d7f66e337810fa8b882ec21f706f3b3c709a53fa126b018',
    );
    expect(SURFACE_ZERO_WITHDRAW_COLL).toEqual(
      '0xfb3234ca0cf70fe9c90b73939f36a37fadcfdef4628afc42dd57d1f26dfd8fb5',
    );
    expect(SURFACE_ZERO_CLAIM_SURPLUS).toEqual(
      '0x44224716871939619faf861b30e39bac8861d4f76b5dd0468d31bf4b7dc684be',
    );
  });

  it('computes fee and net in basis points', () => {
    const gross = Decimal.from(100);
    expect(getExitFeeAmount(gross, 50).toString()).toEqual('0.5'); // 0.5%
    expect(getExitFeeNet(gross, 50).toString()).toEqual('99.5');
    expect(getExitFeeAmount(gross, 0).isZero()).toBe(true);
    expect(getExitFeeNet(gross, 0).toString()).toEqual('100');
    expect(getExitFeeAmount(gross, EXIT_FEE_MAX_BPS).toString()).toEqual('100');
  });

  it('display gate: only active, sane-rate, non-zero fees are shown', () => {
    const fee = Decimal.from('0.5');
    expect(isExitFeeShown(true, 50, fee)).toBe(true);
    expect(isExitFeeShown(false, 50, fee)).toBe(false);
    expect(isExitFeeShown(true, 0, fee)).toBe(false);
    expect(isExitFeeShown(true, 10001, fee)).toBe(false);
    expect(isExitFeeShown(true, 50, Decimal.ZERO)).toBe(false);
  });
});
