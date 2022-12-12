import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

import { BigNumberish, BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

const DEFAULT_UNIT = 18;
const DEFAULT_DECIMALS = 6;

const unitNames = ['wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'];

// helper function to convert any type of ethers value to wei.
export const toWei = (
  value: BigNumberish,
  unitName: BigNumberish = DEFAULT_UNIT,
): BigNumber => {
  if (isBigNumberish(value)) {
    if (typeof unitName === 'string') {
      const index = unitNames.indexOf(unitName);
      if (index !== -1) {
        unitName = 3 * index;
      }
    }

    return BigNumber.from(value).mul(BigNumber.from(10).pow(unitName));
  }

  const number = Number(value);
  if (!Number.isNaN(number) && Number.isFinite(number) && value % 1 !== 0) {
    return parseUnits(number.toString(), unitName);
  }

  throw new Error(`Invalid BigNumberish value: ${value}`);
};

export const fromWei = (
  value: BigNumberish,
  unitName: BigNumberish = DEFAULT_UNIT,
): string => {
  if (isBigNumberish(value)) {
    return formatUnits(BigNumber.from(value).toString(), unitName);
  }

  throw new Error(`Invalid BigNumberish value: ${value}`);
};

export const fromWeiFixed = (
  value: BigNumberish,
  decimals: number = DEFAULT_DECIMALS,
  unitName: BigNumberish = DEFAULT_UNIT,
): string => Number(fromWei(value, unitName)).toFixed(decimals);

export const formatValue = (value: number, precision: number = 0) =>
  value.toLocaleString(navigator.language, {
    maximumFractionDigits: precision,
  });
