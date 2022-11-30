import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

import { BigNumberish, BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

// helper function to convert any type of ethers value to wei.
export const toWei = (value: BigNumberish): BigNumber => {
  if (isBigNumberish(value)) {
    return BigNumber.from(value).mul(BigNumber.from(10).pow(18));
  }

  const number = Number(value);
  if (!Number.isNaN(number) && Number.isFinite(number) && value % 1 !== 0) {
    return parseUnits(number.toString());
  }

  throw new Error(`Invalid BigNumberish value: ${value}`);
};

export const fromWei = (
  value: BigNumberish,
  unitName?: BigNumberish,
): string => {
  if (isBigNumberish(value)) {
    return formatUnits(BigNumber.from(value).toString(), unitName);
  }

  throw new Error(`Invalid BigNumberish value: ${value}`);
};
