import { Decimalish } from '@sovryn/utils';

import { decimalic } from '../../../utils/math';

export const isValueBetweenZeroAndOne = (value: number) =>
  value > 0 && value < 1;

export const calculateDecimalPlaces = (
  value: Decimalish,
  precision: number,
) => {
  if (Number(value) === 0) {
    return 0;
  }
  const decimalValue = decimalic(value).toString();
  const [, decimals = ''] = decimalValue.split('.');
  const nonZeroIndex = decimals.search(/[^0]/);
  return nonZeroIndex !== -1
    ? Math.max(nonZeroIndex + 1, precision)
    : precision;
};
