import { BigNumber, BigNumberish, ethers } from 'ethers';
import { DEFAULT_SWAP_SLIPPAGE } from '../constants';

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
]);

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
