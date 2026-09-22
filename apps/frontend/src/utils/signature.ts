import { ethers } from 'ethers';

/**
 * Canonicalizes a wallet-returned ECDSA signature to the 65-byte r||s||v hex
 * form with v ∈ {27, 28} — the only encoding contracts that feed v straight
 * into ecrecover (e.g. Permit2's SignatureVerification) accept.
 *
 * Wallets that expose raw signer output (Frame, the onboard-ledger module,
 * some WalletConnect/MPC wallets) return v as the recovery id (0/1), and
 * EIP-2098 signers return a 64-byte compact form. ethers' own verification
 * helpers silently tolerate these, so a signature must be normalized with
 * this function before it is sent on-chain, not just verified.
 *
 * r and s are never altered — a high-s signature stays exactly as the wallet
 * produced it (ecrecover accepts it), so canonical signatures pass through
 * bit-identical, re-encoded as lowercase hex. Any other v — including
 * EIP-155-style values, which have no meaning for typed-data signatures —
 * throws here, at signing time, instead of reverting on-chain or recovering
 * the wrong signer.
 */
export const normalizeSignature = (signature: ethers.BytesLike): string => {
  const bytes = ethers.utils.arrayify(signature);
  let v: number;
  let rs: Uint8Array;
  if (bytes.length === 64) {
    // EIP-2098 compact form: yParity lives in the top bit of the s word
    v = 27 + (bytes[32] >> 7);
    rs = new Uint8Array(bytes);
    rs[32] &= 0x7f;
  } else if (bytes.length === 65) {
    v = bytes[64];
    if (v === 0 || v === 1) {
      v += 27;
    }
    if (v !== 27 && v !== 28) {
      throw new Error(`invalid signature v byte: ${bytes[64]}`);
    }
    rs = bytes.slice(0, 64);
  } else {
    throw new Error(`invalid signature length: ${bytes.length}`);
  }
  return ethers.utils.hexlify(ethers.utils.concat([rs, [v]]));
};
