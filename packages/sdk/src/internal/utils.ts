import { BigNumber, BigNumberish, ethers, providers } from 'ethers';

import { DEFAULT_SWAP_SLIPPAGE } from '../constants';
import { SwapPairs } from '../swaps/smart-router/types';

export function defineProperties<T>(
  target: T,
  values: { [K in keyof T]?: T[K] },
): void {
  for (let key in values) {
    let value = values[key];

    Object.defineProperty(target, key, {
      enumerable: true,
      value,
      writable: false,
    });
  }
}

// Wallets exposing raw signer output (Frame, onboard-ledger, some MPC
// wallets) return the ECDSA v byte as the recovery id (0/1), and EIP-2098
// signers return a 64-byte compact form; contracts that feed v straight into
// ecrecover (e.g. Permit2's SignatureVerification) accept only the 65-byte
// r||s||v form with v in {27, 28}. Canonical signatures pass through
// byte-for-byte unchanged; malformed ones throw here instead of on-chain.
export const normalizeSignature = (signature: ethers.BytesLike): string =>
  ethers.utils.joinSignature(ethers.utils.splitSignature(signature));

// slippage 100% = 10000, 1% = 100
export const getMinReturn = (
  amount: BigNumberish,
  slippage: BigNumberish = DEFAULT_SWAP_SLIPPAGE,
) =>
  BigNumber.from(amount).sub(BigNumber.from(amount).mul(slippage).div(10000));

const Erc20IFace = new ethers.utils.Interface([
  'function transfer(address to, uint256 amount) public',
  'function approve(address spender, uint256 amount) public',
  'function allowance(address owner, address spender) public view returns (uint256)',
]);

export const hasEnoughAllowance = async (
  provider: providers.Provider,
  tokenAddress: string,
  owner: string,
  spender: string,
  amount: BigNumberish,
) => {
  const tokenContract = new ethers.Contract(tokenAddress, Erc20IFace, provider);
  const allowance = await tokenContract.allowance(owner, spender);
  return allowance.gte(amount);
};

export const makeApproveRequest = (
  tokenAddress: string,
  spender: string,
  amount: BigNumberish,
) => {
  return {
    to: tokenAddress,
    data: Erc20IFace.encodeFunctionData('approve', [spender, amount]),
  };
};

export const canSwapPair = (
  entry: string,
  destination: string,
  pairs: SwapPairs,
) => {
  const quoteTokens = pairs.get(entry.toLowerCase())?.map(t => t.toLowerCase());
  if (quoteTokens?.includes(destination.toLowerCase())) {
    return true;
  }
  return false;
};

export const areAddressesEqual = (a: string, b: string) =>
  a.toLowerCase() === b.toLowerCase();
