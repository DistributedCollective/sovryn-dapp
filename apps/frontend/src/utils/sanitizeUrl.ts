/**
 * The substring `@trezor/connect-web` scans the query string for when deciding
 * whether to override `connectSrc` (the popup/iframe origin). See
 * `@trezor/connect-web`'s `parseConnectSettings`, which does
 * `window.location.search.split('&').find(v => v.indexOf('trezor-connect-src') >= 0)`.
 */
export const TREZOR_CONNECT_SRC_NEEDLE = 'trezor-connect-src';

/**
 * Removes any query-string segment that `@trezor/connect-web` would treat as a
 * `connectSrc` override.
 *
 * connect-web's `parseConnectSettings` scans `window.location.search.split('&')`
 * and takes the first segment whose text *contains* the substring
 * `trezor-connect-src` (`v.indexOf(...) >= 0`), then uses its value verbatim as the
 * popup/iframe URL with no scheme validation for non-`http` values. A `javascript:`
 * value therefore executes in our origin (Immunefi #40463).
 *
 * Because the library matches by substring, an exact-key filter
 * (`URLSearchParams.has('trezor-connect-src')`) is trivially bypassed by variants
 * such as `trezor-connect-srcz` or `x-trezor-connect-src`. We strip on the same
 * substring basis instead — case-insensitively, a superset of connect-web's
 * case-sensitive match — so no variant survives.
 *
 * @param search Raw `window.location.search` (with or without a leading `?`).
 * @returns The rebuilt query string WITHOUT a leading `?` (an empty string when
 *   every segment was stripped), or `null` when nothing matched and the URL should
 *   be left untouched.
 */
export const stripTrezorConnectSrcParam = (search: string): string | null => {
  if (!search) {
    return null;
  }

  const segments = search.replace(/^\?/, '').split('&');
  const kept = segments.filter(
    segment => !segment.toLowerCase().includes(TREZOR_CONNECT_SRC_NEEDLE),
  );

  if (kept.length === segments.length) {
    return null;
  }

  return kept.join('&');
};
