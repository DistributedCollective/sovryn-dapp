import { commify, formatUnits, parseUnits } from 'ethers/lib/utils';

import { fromWei, toWei } from './math';

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

    it('fails for unexpected value', () => {
      expect(() => toWei('error')).toThrowError(
        'Invalid BigNumberish value: error',
      );
    });
  });

  describe('fromWei()', () => {
    it('convert number to rbtc', () => {
      const value = fromWei(47254);
      expect(value).toEqual('0.000000000000047254');
    });

    it('convert number to gwei', () => {
      const value = fromWei(47254, 9);
      expect(value).toEqual('0.000047254');
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

  it('returns gas in gwei', () => {
    const value = formatUnits(
      parseUnits(gasPrice.toString(), 'gwei').mul(gasLimit),
      'gwei',
    );
    expect(value).toBe('3079.259656');
  });

  it('adds comma as thousand separator', () => {
    const value = commify(123456.789);
    expect(value).toBe('123,456.789');
  });
});
