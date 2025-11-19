import { decimalic } from '../../../../../utils/math';

/** Reject non-finite or absurd USD values; return "0" if invalid. */
export const sanitizeUsd = (raw: unknown, cap = 1e12) => {
  const n = Number(raw ?? 0);
  if (!isFinite(n) || n < 0 || n > cap) return '0';
  return String(n);
};

/** Numeric guard for TVL buckets (RSK/BOB). Values > cap are treated as 0. */
export const sanitizeTvlBucket = (raw: unknown, cap = 1e9): string => {
  const n = Number(raw ?? 0);
  if (!isFinite(n) || n < 0 || n > cap) return '0';
  return String(n);
};

/** Safely convert TVL bucket totalUsd -> decimalic with cap. */
export const safeBucketUsd = (
  bucket?: { totalUsd?: string | number },
  cap = 1e9,
) => decimalic(sanitizeTvlBucket(bucket?.totalUsd, cap));

/** Pick a reasonable BTC/USD from token lists; validate rough range. */
export const pickBtcUsd = (
  tokens: Array<{ symbol?: string; usdPrice?: string | number }> = [],
  symbols: string[],
): number | undefined => {
  for (const s of symbols) {
    const tok = tokens.find(
      t =>
        t?.symbol?.toUpperCase() === s.toUpperCase() && Number(t.usdPrice) > 0,
    );
    const px = Number(tok?.usdPrice);
    if (isFinite(px) && px >= 1_000 && px <= 200_000) return px; // wide but sane
  }
  return undefined;
};
