import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

import { BigNumberish, BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

const DEFAULT_UNIT = 18;
const DEFAULT_DECIMALS = 6;

const DEFAULT_DECIMALS_SEPARATOR = '.';
const DEFAULT_THOUSANDS_SEPARATOR = ',';

const unitNames = ['wei', 'kwei', 'mwei', 'gwei', 'szabo', 'finney', 'ether'];

// helper function to convert any type of ethers value to wei.
export const toWei = (
  value: BigNumberish,
  unitName: BigNumberish = DEFAULT_UNIT,
): BigNumber => {
  if (isBigNumberish(value) || isScientificNumber(value)) {
    if (typeof unitName === 'string') {
      const index = unitNames.indexOf(unitName);
      if (index !== -1) {
        unitName = 3 * index;
      }
    }

    if (isBigNumberish(value)) {
      return BigNumber.from(value).mul(BigNumber.from(10).pow(unitName));
    } else {
      //can't just reuse same logic above, as values in scientific notation are unrecognised by BigNumber
      //so need to convert to weis before passing
      return BigNumber.from(
        Number(value) * 10 ** BigNumber.from(unitName).toNumber(),
      );
    }
  }

  const numberIsANumber =
    Number(value)
      .toString()
      .replace(/[0-9.]/g, '').length === 0;
  const stringIsANumber = String(value).replace(/[0-9.]/g, '').length === 0;

  if (numberIsANumber && stringIsANumber) {
    if (Number(value) % 1 !== 0) {
      return parseUnits(String(value), unitName);
    } else {
      const numberish = String(value);
      const [integer, decimals] = numberish.split('.');

      const bnInteger = BigNumber.from(integer).mul(
        BigNumber.from(10).pow(unitName),
      );

      const bnDecimals = BigNumber.from(decimals).mul(
        BigNumber.from(10).pow(parseUnitValue(unitName) - decimals.length),
      );

      return bnDecimals.add(bnInteger);
    }
  }

  if (stringIsANumber) {
    return parseUnits(value, unitName);
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

export const formatValue = (
  value: number | string,
  precision: number = 0,
  roundUp: boolean = false,
) =>
  Number(value).toLocaleString(navigator.language, {
    maximumFractionDigits: precision,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    roundingMode: roundUp ? 'ceil' : 'halfExpand', // This is an experimental feature with the default value of 'halfExpand', see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat for more information
  });

export const formatCompactValue = (value: number, precision: number = 0) =>
  value.toLocaleString(navigator.language, {
    maximumFractionDigits: precision,
    notation: 'compact',
  });

export const parseUnitValue = (unitName: BigNumberish): number => {
  if (typeof unitName === 'string') {
    const index = unitNames.indexOf(unitName);
    if (index !== -1) {
      unitName = 3 * index;
    }
  }
  return Number(unitName);
};

export const getLocaleSeparators = () => {
  const number = 1200.4;

  const formattedValue = new Intl.NumberFormat(
    navigator.language,
  ).formatToParts(number);

  return {
    decimal:
      formattedValue.find(part => part.type === 'decimal')?.value ||
      DEFAULT_DECIMALS_SEPARATOR,
    thousand:
      formattedValue.find(part => part.type === 'group')?.value ||
      DEFAULT_THOUSANDS_SEPARATOR,
  };
};

export const getDecimalPartLength = (value: string | number) =>
  value?.toString().split('.')?.[1]?.length || 0;

export const numeric = (value: number) => {
  if (isNaN(value) || !isFinite(value) || !value) {
    return 0;
  }
  return value;
};

export const isScientificNumber = (value: number) =>
  String(value).search(/e[-+]/) >= 0;
