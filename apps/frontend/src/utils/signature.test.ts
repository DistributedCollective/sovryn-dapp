import { ethers } from 'ethers';

import { normalizeSignature } from './signature';

describe('utils/signature.ts', () => {
  describe('normalizeSignature()', () => {
    // Wallets that expose raw signer output (Frame, the onboard-ledger module,
    // some WalletConnect/MPC wallets) return the recovery byte as 0/1 instead
    // of 27/28. ethers' verifyTypedData tolerates both forms, but on-chain
    // verifiers that feed v straight into ecrecover (Permit2's
    // SignatureVerification) accept ONLY 27/28 — ecrecover returns the zero
    // address for v=0/1 and the tx reverts with InvalidSignature (0x8baa579f).
    // These cases pin that every wallet-returned form is canonicalized to
    // 65-byte r||s||v with v ∈ {27, 28} before being sent on-chain.

    const r =
      '0x0d8bcec44c865f8f0dd7d3a480ad0eb80cd8fe3575b13d39f7e421ed7c859f00';
    const s =
      '0x3475d99336ce2bf26a5bc6e946769ecc1763cdbce8abf24add0800084e76fbe2';
    const base = r + s.slice(2);

    it('rewrites recovery-id form v=0x00 to v=0x1b (27)', () => {
      expect(normalizeSignature(base + '00')).toBe(base + '1b');
    });

    it('rewrites recovery-id form v=0x01 to v=0x1c (28)', () => {
      expect(normalizeSignature(base + '01')).toBe(base + '1c');
    });

    it('returns canonical v=0x1b signatures byte-for-byte unchanged', () => {
      expect(normalizeSignature(base + '1b')).toBe(base + '1b');
    });

    it('returns canonical v=0x1c signatures byte-for-byte unchanged', () => {
      expect(normalizeSignature(base + '1c')).toBe(base + '1c');
    });

    it('expands 64-byte EIP-2098 compact signatures to canonical 65 bytes', () => {
      const canonical = base + '1b';
      const compact = ethers.utils.splitSignature(canonical).compact;
      expect(ethers.utils.hexDataLength(compact)).toBe(64);
      expect(normalizeSignature(compact)).toBe(canonical);
    });

    it('throws on a malformed recovery byte instead of passing it through', () => {
      expect(() => normalizeSignature(base + '05')).toThrow();
    });

    it('is a no-op for signatures produced by standard (MetaMask-style) signers', async () => {
      const wallet = new ethers.Wallet(
        '0x1111111111111111111111111111111111111111111111111111111111111111',
      );
      const domain = { name: 'Test', version: '1', chainId: 30 };
      const types = {
        Message: [{ name: 'content', type: 'string' }],
      };
      const values = { content: 'hello' };
      const signature = await wallet._signTypedData(domain, types, values);
      expect(normalizeSignature(signature)).toBe(signature);
    });

    it('repairs the exact Frame-wallet Permit2 signature that reverted on-chain (rsk tx 0xa53eef8b…0020b2)', () => {
      // r/s/v and the signed values below are lifted verbatim from the failed
      // closeNueTroveWithPermit2 calldata; the wallet (Frame) returned v=0x00.
      // Replaying that tx with only this byte rewritten to 0x1b succeeds, so
      // the normalized form must recover the original sender.
      const signer = '0xdEd56Aef779B5b30845FF2cb7f1Fc6adC1169ded';
      const normalized = normalizeSignature(base + '00');
      const recovered = ethers.utils.verifyTypedData(
        {
          name: 'Permit2',
          chainId: 30,
          verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
        },
        {
          PermitTransferFrom: [
            { name: 'permitted', type: 'TokenPermissions' },
            { name: 'spender', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
          ],
          TokenPermissions: [
            { name: 'token', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
        },
        {
          permitted: {
            token: '0xc1411567d2670e24d9c4daaa7cda95686e1250aa',
            amount: '0x015d094cf05b0b8a838e',
          },
          spender: '0x5B9dB4B8bdeF3e57323187a9AC2639C5DEe5FD39',
          nonce: '0x019fd8ee9eaf',
          deadline: 0x6a9c8680,
        },
        normalized,
      );
      expect(normalized.slice(-2)).toBe('1b');
      expect(recovered).toBe(signer);
    });
  });
});
