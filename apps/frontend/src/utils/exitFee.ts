import { Decimal } from '@sovryn/utils';

/** 30 s — the perimeter's operational admin can change policy instantly (no timelock), so cache briefly. */
export const EXIT_FEE_TTL = 30_000;
export const EXIT_FEE_MAX_BPS = 10_000;
/** 1e18 reference gross used when only the resolved rate is needed. */
export const EXIT_FEE_REFERENCE_GROSS = '1000000000000000000';

// keccak256(utf8(preimage)) — the on-chain surface ids of the Sovryn Perimeter Fee;
// verified against the deployed lending/Zero consumer constants
export const SURFACE_LENDING_LENDER_WITHDRAW =
  '0x3d0383a7986bf042db59f806aef31f95d28262f3280554c8541c299fa8e2ffb3';
export const SURFACE_LENDING_BORROWER_WITHDRAW =
  '0x5c408ce1df6222b56e2084e292cdc734b880e9adbb4df2331d304431936967f7';
export const SURFACE_ZERO_CLAIM_SURPLUS =
  '0xdd1d6592d9143b113f128998b830887d87bf784969f0bdeda154f2a49ca302e0';

export const getExitFeeAmount = (gross: Decimal, rateBps: number): Decimal =>
  gross.mul(rateBps).div(EXIT_FEE_MAX_BPS);

export const getExitFeeNet = (gross: Decimal, rateBps: number): Decimal =>
  gross.sub(getExitFeeAmount(gross, rateBps));

/** Mirror of the on-chain charge test (PERIMETER_FEE_CALL_GRAPH.md §"Quoting for UIs"). */
export const isExitFeeShown = (
  active: boolean,
  rateBps: number,
  fee: Decimal,
): boolean => active && rateBps > 0 && rateBps <= EXIT_FEE_MAX_BPS && fee.gt(0);
