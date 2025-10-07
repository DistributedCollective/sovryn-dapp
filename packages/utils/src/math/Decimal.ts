import { BigNumber } from '@ethersproject/bignumber';

import assert from 'assert';

const getDigits = (numDigits: number) => TEN.pow(numDigits);

const MAX_UINT_256 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const PRECISION = 18;
const ONE = BigNumber.from(1);
const TEN = BigNumber.from(10);
const DIGITS = getDigits(PRECISION);

const stringRepresentationFormat = /^(-)?[0-9]*(\.[0-9]*)?(e[-+]?[0-9]+)?$/;
const trailingZeros = /0*$/;
const magnitudes = ['', 'K', 'M', 'B', 'T'];

const roundedMul = (x: BigNumber, y: BigNumber) =>
  x.mul(y).add(Decimal.HALF.toHexString()).div(DIGITS);

export type Decimalish = Decimal | number | string;

export class Decimal {
  static readonly INFINITY = Decimal.fromBigNumberString(MAX_UINT_256);
  static readonly ZERO = Decimal.from(0);
  static readonly HALF = Decimal.from(0.5);
  static readonly ONE = Decimal.from(1);

  private readonly _bigNumber: BigNumber;

  private constructor(bigNumber: BigNumber) {
    this._bigNumber = bigNumber;
  }

  static fromBigNumberString(bigNumberString: string): Decimal {
    return new Decimal(BigNumber.from(bigNumberString));
  }

  private static _fromString(representation: string): Decimal {
    if (representation === 'Infinity') {
      return Decimal.INFINITY;
    }

    if (!representation || !representation.match(stringRepresentationFormat)) {
      throw new Error(`bad decimal format: "${representation}"`);
    }

    if (representation.includes('e')) {
      // eslint-disable-next-line prefer-const
      let [coefficient, exponent] = representation.split('e');

      if (exponent.startsWith('-')) {
        return new Decimal(
          Decimal._fromString(coefficient)._bigNumber.div(
            TEN.pow(BigNumber.from(exponent.substr(1))),
          ),
        );
      }

      if (exponent.startsWith('+')) {
        exponent = exponent.substr(1);
      }

      return new Decimal(
        Decimal._fromString(coefficient)._bigNumber.mul(
          TEN.pow(BigNumber.from(exponent)),
        ),
      );
    }

    if (!representation.includes('.')) {
      return new Decimal(BigNumber.from(representation).mul(DIGITS));
    }

    // eslint-disable-next-line prefer-const
    let [characteristic, mantissa] = representation.split('.');

    if (mantissa.length < PRECISION) {
      mantissa += '0'.repeat(PRECISION - mantissa.length);
    } else {
      mantissa = mantissa.substr(0, PRECISION);
    }

    return new Decimal(
      BigNumber.from(characteristic || 0)
        .mul(DIGITS)
        .add(mantissa),
    );
  }

  static from(decimalish: Decimalish): Decimal {
    switch (typeof decimalish) {
      case 'object':
        if (decimalish instanceof Decimal) {
          return decimalish;
        } else if (decimalish === null || decimalish === undefined) {
          return Decimal.ZERO;
        } else {
          throw new Error(
            'invalid Decimalish value: ' +
              typeof decimalish +
              '(' +
              decimalish +
              ')',
          );
        }
      case 'string':
        return Decimal._fromString(decimalish);
      case 'number':
        return Decimal._fromString(decimalish.toString());
      default:
        throw new Error(
          'invalid Decimalish value: ' +
            typeof decimalish +
            '(' +
            decimalish +
            ')',
        );
    }
  }

  private _toStringWithAutomaticPrecision() {
    const characteristic = this._bigNumber.div(DIGITS);
    const mantissa = this._bigNumber.abs().mod(DIGITS);

    if (mantissa.isZero()) {
      return characteristic.toString();
    } else {
      const symbol = this._bigNumber.isNegative() ? '-' : '';
      const paddedMantissa = mantissa.toString().padStart(PRECISION, '0');
      const trimmedMantissa = paddedMantissa.replace(trailingZeros, '');
      return symbol + characteristic.abs().toString() + '.' + trimmedMantissa;
    }
  }

  private _roundUp(precision: number) {
    const halfDigit = getDigits(PRECISION - 1 - precision).mul(5);
    if (this._bigNumber.isNegative()) {
      return this._bigNumber.sub(halfDigit);
    }
    return this._bigNumber.add(halfDigit);
  }

  private _toStringWithPrecision(precision: number) {
    if (precision < 0) {
      throw new Error('precision must not be negative');
    }

    const value =
      precision < PRECISION ? this._roundUp(precision) : this._bigNumber;
    const characteristic = value.div(DIGITS);
    const mantissa = value.abs().mod(DIGITS);

    if (precision === 0) {
      return characteristic.toString();
    } else {
      const symbol = this._bigNumber.isNegative() ? '-' : '';
      const paddedMantissa = mantissa.toString().padStart(PRECISION, '0');
      const trimmedMantissa = paddedMantissa.substr(0, precision);
      return symbol + characteristic.abs().toString() + '.' + trimmedMantissa;
    }
  }

  toNumber(): number {
    return parseFloat(this.toString());
  }

  toBigNumber(): BigNumber {
    return this._bigNumber;
  }

  toHexString(): string {
    return this._bigNumber.toHexString();
  }

  toString(precision?: number): string {
    if (this.infinite) {
      return '0';
    } else if (precision !== undefined) {
      return this._toStringWithPrecision(precision);
    } else {
      return this._toStringWithAutomaticPrecision();
    }
  }

  prettify(precision = 2): string {
    const [characteristic, mantissa] = parseFloat(this.toString(precision))
      .toString()
      .split('.');
    const prettyCharacteristic = characteristic.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      '$1,',
    );

    return mantissa !== undefined
      ? prettyCharacteristic + '.' + mantissa
      : prettyCharacteristic;
  }

  shorten(): string {
    const characteristicLength = this.toString(0).length;
    const magnitude = Math.min(
      Math.floor((characteristicLength - 1) / 3),
      magnitudes.length - 1,
    );

    const precision = Math.max(3 * (magnitude + 1) - characteristicLength, 0);
    const normalized = this.div(
      new Decimal(getDigits(PRECISION + 3 * magnitude)),
    );

    return normalized.prettify(precision) + magnitudes[magnitude];
  }

  add(addend: Decimalish): Decimal {
    return new Decimal(this._bigNumber.add(Decimal.from(addend)._bigNumber));
  }

  sub(subtrahend: Decimalish): Decimal {
    return new Decimal(
      this._bigNumber.sub(Decimal.from(subtrahend)._bigNumber),
    );
  }

  mul(multiplier: Decimalish): Decimal {
    return new Decimal(
      this._bigNumber.mul(Decimal.from(multiplier)._bigNumber).div(DIGITS),
    );
  }

  div(divider: Decimalish): Decimal {
    divider = Decimal.from(divider);

    if (divider.isZero()) {
      return Decimal.INFINITY;
    }

    return new Decimal(this._bigNumber.mul(DIGITS).div(divider._bigNumber));
  }

  /** @internal */
  _divCeil(divider: Decimalish): Decimal {
    divider = Decimal.from(divider);

    if (divider.isZero()) {
      return Decimal.INFINITY;
    }

    return new Decimal(
      this._bigNumber
        .mul(DIGITS)
        .add(divider._bigNumber.sub(ONE))
        .div(divider._bigNumber),
    );
  }

  mulDiv(multiplier: Decimalish, divider: Decimalish): Decimal {
    multiplier = Decimal.from(multiplier);
    divider = Decimal.from(divider);

    if (divider.isZero()) {
      return Decimal.INFINITY;
    }

    return new Decimal(
      this._bigNumber.mul(multiplier._bigNumber).div(divider._bigNumber),
    );
  }

  pow(exponent: number): Decimal {
    assert(Number.isInteger(exponent));
    assert(0 <= exponent && exponent <= 0xffffffff); // Ensure we're safe to use bitwise ops

    if (exponent === 0) {
      return Decimal.ONE;
    }

    if (exponent === 1) {
      return this;
    }

    let x = this._bigNumber;
    let y = DIGITS;

    for (; exponent > 1; exponent >>>= 1) {
      if (exponent & 1) {
        y = roundedMul(x, y);
      }

      x = roundedMul(x, x);
    }

    return new Decimal(roundedMul(x, y));
  }

  isZero(): boolean {
    return this._bigNumber.isZero();
  }

  isNegative(): boolean {
    return this._bigNumber.isNegative();
  }

  abs() {
    if (this._bigNumber._hex[0] === '-') {
      return Decimal.fromBigNumberString(
        BigNumber.from(this._bigNumber._hex.substring(1)).toString(),
      );
    }
    return this;
  }

  toUnits(unit: number = PRECISION): Decimal {
    return this.div(Math.pow(10, unit));
  }

  asUnits(unit: number = 0): Decimal {
    return this.div(Math.pow(10, PRECISION - unit));
  }

  get zero(): this | undefined {
    if (this.isZero()) {
      return this;
    }
    return undefined;
  }

  get nonZero(): this | undefined {
    if (!this.isZero()) {
      return this;
    }
    return undefined;
  }

  get infinite(): this | undefined {
    if (this.eq(Decimal.INFINITY)) {
      return this;
    }
    return undefined;
  }

  get finite(): this | undefined {
    if (!this.eq(Decimal.INFINITY)) {
      return this;
    }
    return undefined;
  }

  /** @internal */
  get absoluteValue(): this {
    return this;
  }

  lt(that: Decimalish): boolean {
    return this._bigNumber.lt(Decimal.from(that)._bigNumber);
  }

  eq(that: Decimalish): boolean {
    return this._bigNumber.eq(Decimal.from(that)._bigNumber);
  }

  gt(that: Decimalish): boolean {
    return this._bigNumber.gt(Decimal.from(that)._bigNumber);
  }

  gte(that: Decimalish): boolean {
    return this._bigNumber.gte(Decimal.from(that)._bigNumber);
  }

  lte(that: Decimalish): boolean {
    return this._bigNumber.lte(Decimal.from(that)._bigNumber);
  }

  static min(...values: Decimalish[]): Decimal {
    return values.map(Decimal.from).reduce((p, c) => {
      return p.lt(c) ? p : c;
    }, Decimal.from(values[0]));
  }

  static max(...values: Decimalish[]): Decimal {
    return values.map(Decimal.from).reduce((p, c) => {
      return p.gt(c) ? p : c;
    }, Decimal.from(values[0]));
  }
}
