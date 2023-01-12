import type { BigNumberish } from '@ethersproject/bignumber';

import BigNumber from 'bignumber.js';
import { formatUnits } from 'ethers/lib/utils';

export const calculateCollateralRatio = (
  collateral: string,
  debt: string,
  price: string,
) => (((Number(collateral) * Number(price)) / Number(debt)) * 100).toFixed(2);

export const parseBalance = (
  value: BigNumberish | undefined,
  decimals = 18,
  decimalsToDisplay = 2,
) =>
  new BigNumber(formatUnits(value || 0, decimals)).toFixed(decimalsToDisplay);
