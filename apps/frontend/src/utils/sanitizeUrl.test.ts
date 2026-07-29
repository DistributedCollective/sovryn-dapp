import { stripTrezorConnectSrcParam } from './sanitizeUrl';

describe('utils/sanitizeUrl.ts', () => {
  describe('stripTrezorConnectSrcParam()', () => {
    // @trezor/connect-web's parseConnectSettings picks up `connectSrc` from ANY
    // '&'-delimited query segment whose text *contains* the substring
    // "trezor-connect-src" (`v.indexOf(...) >= 0`), then uses its value verbatim as
    // the popup/iframe URL with no scheme validation for non-http values — so a
    // `javascript:` value executes in our origin (Immunefi #40463). These cases pin
    // down that we strip on the SAME substring basis, not an exact key, so the
    // `…-srcz` (and similar) bypasses cannot slip through.

    it('strips the exact trezor-connect-src param', () => {
      expect(
        stripTrezorConnectSrcParam('?trezor-connect-src=javascript:alert(1)'),
      ).toBe('');
    });

    it('strips the trailing-character bypass variant (trezor-connect-srcz)', () => {
      expect(
        stripTrezorConnectSrcParam(
          '?trezor-connect-srcz=javascript://ex.com/%250aalert(document.domain)//',
        ),
      ).toBe('');
    });

    it('strips a leading-character variant (x-prefixed)', () => {
      expect(
        stripTrezorConnectSrcParam('?xtrezor-connect-src=javascript:alert(1)'),
      ).toBe('');
    });

    it('strips case-insensitively (superset of connect-web’s case-sensitive match)', () => {
      expect(
        stripTrezorConnectSrcParam('?Trezor-Connect-Srcz=javascript:alert(1)'),
      ).toBe('');
    });

    it('removes only the offending segment and preserves the rest', () => {
      expect(
        stripTrezorConnectSrcParam('?a=1&trezor-connect-srcz=evil&b=2'),
      ).toBe('a=1&b=2');
    });

    it('removes every offending segment when several are present', () => {
      expect(
        stripTrezorConnectSrcParam(
          '?trezor-connect-src=1&x-trezor-connect-src=2',
        ),
      ).toBe('');
    });

    it('returns null when no matching param is present', () => {
      expect(stripTrezorConnectSrcParam('?a=1&b=2')).toBeNull();
    });

    it('returns null for an empty query string', () => {
      expect(stripTrezorConnectSrcParam('')).toBeNull();
    });
  });
});
