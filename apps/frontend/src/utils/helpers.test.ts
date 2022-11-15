import { prettyTx } from './helpers';

const ADDRESS = '0x1234567890123456789012345678901234567890';

describe('utils/helpers.ts', () => {
  describe('prettyTx', () => {
    it('should return pretty tx', () => {
      expect(prettyTx(ADDRESS)).toBe('0x1234 ··· 7890');
    });

    it('should return pretty tx using custom options', () => {
      expect(prettyTx(ADDRESS, 4, 6)).toBe('0x12 ··· 567890');
    });
  });
});
