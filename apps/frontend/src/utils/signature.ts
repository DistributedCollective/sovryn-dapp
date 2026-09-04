import { ethers } from 'ethers';

/**
 * Canonicalizes a wallet-returned ECDSA signature to the 65-byte r||s||v hex
 * form with v ∈ {27, 28} — the only encoding contracts that feed v straight
 * into ecrecover (e.g. Permit2's SignatureVerification) accept.
 *
 * Wallets that expose raw signer output (Frame, the onboard-ledger module,
 * some WalletConnect/MPC wallets) return v as the recovery id (0/1), and
 * EIP-2098 signers return a 64-byte compact form. ethers' own verification
 * helpers silently tolerate all of these, so a signature must be normalized
 * with this function before it is sent on-chain, not just verified.
 *
 * Canonical signatures pass through byte-for-byte unchanged; a malformed
 * recovery byte throws here, at signing time, instead of reverting on-chain.
 */
export const normalizeSignature = (signature: ethers.BytesLike): string =>
  ethers.utils.joinSignature(ethers.utils.splitSignature(signature));
