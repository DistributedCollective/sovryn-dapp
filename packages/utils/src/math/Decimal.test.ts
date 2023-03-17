import { Decimal } from './Decimal';

describe('math/Decimal.ts', () => {
  it('creates a Decimal from a number', () => {
    const d = Decimal.from(1);
    expect(d.toString()).toBe('1');
    expect(String(d)).toBe('1');
  });

  it('resolves decimal to bignumber', () => {
    const d = Decimal.from('1');
    expect(d.toBigNumber().toString()).toBe('1000000000000000000');
  });

  it('creates a Decimal from a BigNumber', () => {
    const d = Decimal.fromBigNumberString('1');
    expect(d.toString()).toBe('0.000000000000000001');
  });

  it('resolves decimal to bignumber', () => {
    const d = Decimal.fromBigNumberString('1');
    expect(d.toBigNumber().toString()).toBe('1');
  });

  it('creates a Decimal from scientific strings', () => {
    const d = Decimal.from('1e-18');
    expect(d.toString()).toBe('0.000000000000000001');
  });

  it('cant create a Decimal from larger scientific strings', () => {
    const d = Decimal.from('1e-19');
    expect(d.toString()).toBe('0');
  });

  describe('as a number', () => {
    it('can render number', () => {
      const d = Decimal.from('1');
      expect(d.toNumber()).toBe(1);
      expect(Number(d)).toBe(1);
    });

    it('can render a number from bignumber', () => {
      const d = Decimal.fromBigNumberString('1');
      expect(d.toNumber()).toBe(1e-18);
    });

    it('can render a number from bignumber too', () => {
      const d = Decimal.fromBigNumberString('10000000000000');
      expect(d.toNumber()).toBe(0.00001);
    });
  });

  describe('min & max', () => {
    it('can find the min', () => {
      const d = Decimal.min(
        Decimal.from('1'),
        Decimal.from('2'),
        Decimal.from('0.4'),
      );
      expect(d.toString()).toBe('0.4');
    });

    it('can find the max', () => {
      const d = Decimal.max(
        Decimal.from('1'),
        Decimal.from('2'),
        Decimal.from('0.4'),
      );
      expect(d.toString()).toBe('2');
    });
  });

  describe('negative', () => {
    it('number can be negative', () => {
      const d = Decimal.from(-1);
      expect(d.toString()).toBe('-1');
    });
    it('number can be negative', () => {
      const d = Decimal.from(-1);
      expect(d.toString(5)).toBe('-1.00000');
    });
    it('bignumber renders negative values on automatic precision', () => {
      const d = Decimal.fromBigNumberString('-1');
      expect(d.toString()).toBe('-0.000000000000000001');
    });

    it('bignumber renders negative values on custom precision (18)', () => {
      const d = Decimal.fromBigNumberString('-100');
      expect(d.toString(18)).toBe('-0.000000000000000100');
    });

    it('bignumber renders negative values on custom precision (14)', () => {
      const d = Decimal.fromBigNumberString('-10000');
      expect(d.toString(14)).toBe('-0.00000000000001');
    });
  });
});
