import { utils } from 'ethers';

import { Decimal } from '@sovryn/utils';

import {
  EXIT_FEE_MAX_BPS,
  SURFACE_LENDING_BORROWER_WITHDRAW,
  SURFACE_LENDING_LENDER_WITHDRAW,
  SURFACE_ZERO_CLAIM_SURPLUS,
  getExitFeeAmount,
  getExitFeeNet,
  isExitFeeShown,
} from './exitFee';

describe('exitFee utils', () => {
  it('surface ids match keccak256 of the registry preimages', () => {
    expect(SURFACE_LENDING_LENDER_WITHDRAW).toEqual(
      utils.id('COLFEE:SURFACE_LENDING_LENDER_WITHDRAW'),
    );
    expect(SURFACE_LENDING_BORROWER_WITHDRAW).toEqual(
      utils.id('COLFEE:SURFACE_LENDING_BORROWER_WITHDRAW'),
    );
    expect(SURFACE_ZERO_CLAIM_SURPLUS).toEqual(
      utils.id('COLFEE:SURFACE_ZERO_CLAIM_SURPLUS'),
    );
    // pin the literals so a typo in the preimage string cannot pass silently
    expect(SURFACE_LENDING_LENDER_WITHDRAW).toEqual(
      '0x3d0383a7986bf042db59f806aef31f95d28262f3280554c8541c299fa8e2ffb3',
    );
    expect(SURFACE_LENDING_BORROWER_WITHDRAW).toEqual(
      '0x5c408ce1df6222b56e2084e292cdc734b880e9adbb4df2331d304431936967f7',
    );
    expect(SURFACE_ZERO_CLAIM_SURPLUS).toEqual(
      '0xdd1d6592d9143b113f128998b830887d87bf784969f0bdeda154f2a49ca302e0',
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
