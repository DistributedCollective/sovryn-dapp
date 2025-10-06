import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

import { BigNumberish, BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { Decimal, Decimalish } from '@sovryn/utils';

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
      return BigNumber.from(String(value)).mul(
        BigNumber.from(10).pow(unitName),
      );
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
  value: Decimalish,
  precision: number = 0,
  roundUp: boolean = false,
) => {
  let formattedValue = decimalic(value).toNumber();

  // Manual rounding logic
  if (roundUp) {
    formattedValue =
      Math.ceil(formattedValue * Math.pow(10, precision)) /
      Math.pow(10, precision);
  } else {
    formattedValue =
      Math.floor(formattedValue * Math.pow(10, precision)) /
      Math.pow(10, precision);
  }

  return formattedValue.toLocaleString(navigator.language, {
    maximumFractionDigits: precision,
  });
};

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

export const getDecimalPartLength = (value: Decimalish) =>
  decimalic(value).toString().split('.')?.[1]?.length || 0;

export const decimalic = (value: Decimalish | undefined | null): Decimal => {
  value = Decimal.from(value || 0);
  if (value.infinite || !value) {
    return Decimal.ZERO;
  }
  return value;
};

export const bigNumberic = (
  value: BigNumberish | undefined | null,
): BigNumber => {
  if (String(value).search(/e[-+]?/) > 0) {
    return BigNumber.from(
      Number(value).toLocaleString('fullwide', { useGrouping: false }),
    );
  }
  return BigNumber.from(String(value || 0));
};

export const isScientificNumber = (value: number) =>
  String(value).search(/e[-+]?/) > 0;
