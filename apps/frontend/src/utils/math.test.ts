import { BigNumber } from 'ethers';
import { commify, formatUnits, parseUnits } from 'ethers/lib/utils';

import { fromWei, fromWeiFixed, toWei } from './math';

const gasPrice = 0.065164;
const gasLimit = 47254;

describe('utils/math.ts', () => {
  describe('toWei()', () => {
    it('converts floating numbers to wei', () => {
      const value = toWei(gasPrice).toString();
      expect(value).toEqual('65164000000000000');
    });

    it('converts gwei floating numbers to wei', () => {
      const value = toWei(gasPrice)
        .div(10 ** 9)
        .toString();
      expect(value).toEqual('65164000');
    });

    it('converts full number to wei', () => {
      const value = toWei(47254).toString();
      expect(value).toEqual('47254000000000000000000');
    });

    it('converts 1 wei to 1**0', () => {
      expect(toWei(1, 0).toString()).toEqual('1');
      expect(toWei(1, 'wei').toString()).toEqual('1');
    });

    it('converts 1 wei to 1**9', () => {
      expect(toWei(1, 9).toString()).toEqual('1000000000');
      expect(toWei(1, 'gwei').toString()).toEqual('1000000000');
    });

    it('converts 1 wei to 10**18', () => {
      expect(toWei(1, 18).toString()).toEqual('1000000000000000000');
      expect(toWei(1, 'ether').toString()).toEqual('1000000000000000000');
    });

    it('fails for unexpected value', () => {
      expect(() => toWei('error')).toThrowError(
        'Invalid BigNumberish value: error',
      );
    });

    it('fails for invalid unit name', () => {
      expect(() => toWei(1, 'fail')).toThrowError();
    });
  });

  describe('fromWei()', () => {
    it('convert number to rbtc', () => {
      expect(fromWei(47254)).toEqual('0.000000000000047254');
      expect(fromWei(47254, 18)).toEqual('0.000000000000047254');
      expect(fromWei(47254, 'ether')).toEqual('0.000000000000047254');
    });

    it('convert number to gwei', () => {
      expect(fromWei(47254, 9)).toEqual('0.000047254');
      expect(fromWei(47254, 'gwei')).toEqual('0.000047254');
    });

    it('convert string to gwei', () => {
      expect(fromWei('47254', 9)).toEqual('0.000047254');
      expect(fromWei('47254', 'gwei')).toEqual('0.000047254');
    });

    it('convert bignumber to gwei', () => {
      expect(fromWei(BigNumber.from(25), 9)).toEqual('0.000000025');
      expect(fromWei(BigNumber.from(25), 'gwei')).toEqual('0.000000025');
    });

    it('fails for floating value', () => {
      expect(() => fromWei(gasPrice)).toThrowError(
        `Invalid BigNumberish value: ${gasPrice}`,
      );
    });

    it('fails for unexpected value', () => {
      expect(() => fromWei('error')).toThrowError(
        'Invalid BigNumberish value: error',
      );
    });
  });

  describe('fromWeiFixed()', () => {
    it('convert number to rbtc', () => {
      expect(fromWeiFixed(47254)).toEqual('0.000000');
      expect(fromWeiFixed(47254, 4, 18)).toEqual('0.0000');
      expect(fromWeiFixed(47254, 4, 'ether')).toEqual('0.0000');
    });

    it('convert number to gwei', () => {
      expect(fromWeiFixed(47254, 6, 9)).toEqual('0.000047');
      expect(fromWeiFixed(47254, 6, 'gwei')).toEqual('0.000047');
      expect(fromWeiFixed(47254, 5, 'gwei')).toEqual('0.00005');
    });

    it('fails for floating value', () => {
      expect(() => fromWeiFixed(gasPrice)).toThrowError(
        `Invalid BigNumberish value: ${gasPrice}`,
      );
    });

    it('fails for unexpected value', () => {
      expect(() => fromWeiFixed('error')).toThrowError(
        'Invalid BigNumberish value: error',
      );
    });
  });
});

describe('ethers/lib/utils', () => {
  it('returns gas in rbtc', () => {
    const value = formatUnits(
      parseUnits(gasPrice.toString(), 'gwei').mul(gasLimit),
    );
    expect(value).toBe('0.000003079259656');
  });

  it('returns gas in gwei', () => {
    const value = formatUnits(
      parseUnits(gasPrice.toString(), 'gwei').mul(gasLimit),
      'gwei',
    );
    expect(value).toBe('3079.259656');
  });

  it('adds comma as thousands separator', () => {
    const value = commify(123456.789);
    expect(value).toBe('123,456.789');
  });
});
