import { ethers } from 'ethers';

import { normalizeSignature } from '../../internal/utils';

describe('internal/utils', () => {
  describe('normalizeSignature()', () => {
    // Contracts that feed v straight into ecrecover (Permit2's
    // SignatureVerification) accept only 65-byte r||s||v with v in {27, 28}.
    // These cases pin the full input matrix: recovery-id v (0/1) is mapped,
    // canonical v passes through bit-identical (including high-s — r and s
    // must never be touched), EIP-2098 compact is expanded, and every other
    // v — including EIP-155-style values, meaningless for typed data — is
    // rejected at build time instead of on-chain.

    const r =
      '0x0d8bcec44c865f8f0dd7d3a480ad0eb80cd8fe3575b13d39f7e421ed7c859f00';
    const lowS =
      '3475d99336ce2bf26a5bc6e946769ecc1763cdbce8abf24add0800084e76fbe2';
    const highS =
      'b475d99336ce2bf26a5bc6e946769ecc1763cdbce8abf24add0800084e76fbe2';
    const base = r + lowS;

    it('rewrites recovery-id v=0x00 to 0x1b and v=0x01 to 0x1c', () => {
      expect(normalizeSignature(base + '00')).toBe(base + '1b');
      expect(normalizeSignature(base + '01')).toBe(base + '1c');
    });

    it('returns canonical signatures unchanged', () => {
      expect(normalizeSignature(base + '1b')).toBe(base + '1b');
      expect(normalizeSignature(base + '1c')).toBe(base + '1c');
    });

    it('preserves a high-s signature exactly (r and s are never altered)', () => {
      expect(normalizeSignature(r + highS + '1b')).toBe(r + highS + '1b');
      expect(normalizeSignature(r + highS + '1c')).toBe(r + highS + '1c');
    });

    it('expands a 64-byte EIP-2098 compact signature to canonical 65 bytes', () => {
      const compact = ethers.utils.splitSignature(base + '1c').compact;
      expect(ethers.utils.hexDataLength(compact)).toBe(64);
      expect(normalizeSignature(compact)).toBe(base + '1c');
    });

    it.each([2, 5, 26, 29, 30, 34, 35, 37, 38, 255])(
      'rejects out-of-range v byte %i instead of folding it silently',
      v => {
        const sig = base + v.toString(16).padStart(2, '0');
        expect(() => normalizeSignature(sig)).toThrowError(
          /invalid signature v byte/,
        );
      },
    );

    it('rejects signatures that are not 64 or 65 bytes', () => {
      expect(() => normalizeSignature(base.slice(0, -2))).toThrowError(
        /invalid signature length/,
      );
      expect(() => normalizeSignature(base + '1b1b')).toThrowError(
        /invalid signature length/,
      );
    });
  });
});
