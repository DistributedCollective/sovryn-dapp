// Slippage tolerance input policy. Not to be confused with
// MAXIMUM_ALLOWED_SLIPPAGE in ConvertPage.constants.ts, which gates the
// quoted price impact of a swap, not the user-entered tolerance.
export const SLIPPAGE_TOLERANCE_WARNING_THRESHOLD = 5;
export const MAXIMUM_SLIPPAGE_TOLERANCE = 49;

export const isHighSlippageTolerance = (value: string) =>
  Number(value) > SLIPPAGE_TOLERANCE_WARNING_THRESHOLD;

// The input's HTML max attribute does not block typed values, so values
// above the cap must also be rejected here and block submission.
export const isInvalidSlippageTolerance = (value: string) =>
  Number(value) > MAXIMUM_SLIPPAGE_TOLERANCE;
