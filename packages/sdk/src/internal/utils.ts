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

export const unique = <T>(arr: T[]) => Array.from(new Set(arr));
