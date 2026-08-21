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
// Not consumed by any component: the Zero collateral-withdrawal fee comes from
// the contract's own previewZeroCollWithdrawExitFee, which resolves the surface
// on chain. It is declared and pinned anyway, as a drift canary — the test below
// fails if this id stops matching the contracts. Do not delete it as dead code.
export const SURFACE_ZERO_WITHDRAW_COLL =
  '0xfb3234ca0cf70fe9c90b73939f36a37fadcfdef4628afc42dd57d1f26dfd8fb5';
export const SURFACE_ZERO_CLAIM_SURPLUS =
  '0x44224716871939619faf861b30e39bac8861d4f76b5dd0468d31bf4b7dc684be';

export const getExitFeeAmount = (gross: Decimal, rateBps: number): Decimal =>
  gross.mul(rateBps).div(EXIT_FEE_MAX_BPS);

export const getExitFeeNet = (gross: Decimal, rateBps: number): Decimal =>
  gross.sub(getExitFeeAmount(gross, rateBps));

/**
 * Mirror of the on-chain charge test (PERIMETER_FEE_CALL_GRAPH.md §"Quoting for UIs").
 *
 * This answers "would a fee be charged", and ONLY that. It cannot tell you
 * whether the quote behind `active`/`rateBps` was actually obtained — pass the
 * whole quote to `getExitFeeDisplay` instead of calling this directly.
 */
export const isExitFeeShown = (
  active: boolean,
  rateBps: number,
  fee: Decimal,
): boolean => active && rateBps > 0 && rateBps <= EXIT_FEE_MAX_BPS && fee.gt(0);

/**
 * A quote, including whether we managed to get one.
 *
 * `unknown` exists because the perimeter fails open on chain: an unreachable
 * controller, a reverting call or a surface with no policy all resolve to "no
 * fee". Those are indistinguishable from a deliberate zero rate in the raw
 * numbers, so the hooks report which of the two happened here rather than
 * flattening both to `active: false`.
 */
export type ExitFeeQuote = {
  active: boolean;
  rateBps: number;
  loading: boolean;
  /** True when no quote was obtained. NOT the same as a rate of zero. */
  unknown: boolean;
};

/** What the UI should show. Three states, because there are three truths. */
export type ExitFeeDisplay = 'charged' | 'none' | 'unknown';

/**
 * The single display decision. Folds `loading` in deliberately: a quote that
 * has not arrived yet is not evidence of a zero fee, and every consumer that
 * destructured `{ active, rateBps }` and dropped `loading` rendered "no fee"
 * during the first fetch and for the whole cache TTL after any RPC blip.
 */
export const getExitFeeDisplay = (
  quote: ExitFeeQuote,
  fee: Decimal,
): ExitFeeDisplay => {
  if (quote.loading || quote.unknown) {
    return 'unknown';
  }
  return isExitFeeShown(quote.active, quote.rateBps, fee) ? 'charged' : 'none';
};
