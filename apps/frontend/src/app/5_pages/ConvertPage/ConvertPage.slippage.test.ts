import {
  MAXIMUM_SLIPPAGE_TOLERANCE,
  SLIPPAGE_TOLERANCE_WARNING_THRESHOLD,
  isHighSlippageTolerance,
  isInvalidSlippageTolerance,
} from './ConvertPage.slippage';

describe('ConvertPage slippage tolerance policy', () => {
  it('warns above 5% and hard-caps at 49%', () => {
    expect(SLIPPAGE_TOLERANCE_WARNING_THRESHOLD).toBe(5);
    expect(MAXIMUM_SLIPPAGE_TOLERANCE).toBe(49);
  });

  describe('isHighSlippageTolerance', () => {
    it('does not warn for the default tolerance', () => {
      expect(isHighSlippageTolerance('0.5')).toBe(false);
    });

    it('does not warn just below 5%', () => {
      expect(isHighSlippageTolerance('4.99')).toBe(false);
    });

    it('warns at exactly 5% (catches 5 typed instead of 0.5)', () => {
      expect(isHighSlippageTolerance('5')).toBe(true);
    });

    it('warns at 5.01%', () => {
      expect(isHighSlippageTolerance('5.01')).toBe(true);
    });

    it('warns at 6%', () => {
      expect(isHighSlippageTolerance('6')).toBe(true);
    });

    it('warns at 49%', () => {
      expect(isHighSlippageTolerance('49')).toBe(true);
    });

    it('does not warn for an empty input', () => {
      expect(isHighSlippageTolerance('')).toBe(false);
    });
  });

  describe('isInvalidSlippageTolerance', () => {
    it('allows the default tolerance', () => {
      expect(isInvalidSlippageTolerance('0.5')).toBe(false);
    });

    it('allows 5.01% and 6% (warning only, swap still allowed)', () => {
      expect(isInvalidSlippageTolerance('5.01')).toBe(false);
      expect(isInvalidSlippageTolerance('6')).toBe(false);
    });

    it('allows exactly 49%', () => {
      expect(isInvalidSlippageTolerance('49')).toBe(false);
    });

    it('blocks 49.01%', () => {
      expect(isInvalidSlippageTolerance('49.01')).toBe(true);
    });

    it('blocks 50%', () => {
      expect(isInvalidSlippageTolerance('50')).toBe(true);
    });

    it('blocks 100%', () => {
      expect(isInvalidSlippageTolerance('100')).toBe(true);
    });

    it('allows an empty input', () => {
      expect(isInvalidSlippageTolerance('')).toBe(false);
    });
  });
});
