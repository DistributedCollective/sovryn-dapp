import { Decimal } from '@sovryn/utils';

/** 30 s — the perimeter's operational admin can change policy instantly (no timelock), so cache briefly. */
export const EXIT_FEE_TTL = 30_000;
export const EXIT_FEE_MAX_BPS = 10_000;
/** 1e18 reference gross used when only the resolved rate is needed. */
export const EXIT_FEE_REFERENCE_GROSS = '1000000000000000000';

// keccak256(utf8(preimage)) — the on-chain surface ids of the Sovryn Perimeter.
// Each preimage is the literal name of the constant the consumer contracts
// declare, so the id and the name cannot drift apart. Verified against the
// deployed lending and Zero consumers; pinned in exitFee.test.ts.
export const SURFACE_LENDING_LENDER_WITHDRAW =
  '0xd4896528a9fba849e3d3db442dea05ef8f08c93e00cc760acac34c42a7dacffe';
export const SURFACE_LENDING_BORROWER_WITHDRAW =
  '0xfa502ea562018a194d7f66e337810fa8b882ec21f706f3b3c709a53fa126b018';
export const SURFACE_ZERO_WITHDRAW_COLL =
  '0xfb3234ca0cf70fe9c90b73939f36a37fadcfdef4628afc42dd57d1f26dfd8fb5';
export const SURFACE_ZERO_CLAIM_SURPLUS =
  '0x44224716871939619faf861b30e39bac8861d4f76b5dd0468d31bf4b7dc684be';

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
