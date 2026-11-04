import { LendingPoolDictionary } from './LendingPoolDictionary';
import { COMMON_SYMBOLS } from './asset';

// Pool construction resolves assets immediately, using the real chain IDs.
const DISABLED_COLLATERAL = [COMMON_SYMBOLS.SOV, COMMON_SYMBOLS.BPRO];

describe('utils/LendingPoolDictionary.ts', () => {
  it('excludes SOV and BPRO from active collateral lists', () => {
    LendingPoolDictionary.list().forEach(pool => {
      expect(pool.getActiveBorrowCollateral()).toEqual(
        expect.not.arrayContaining(DISABLED_COLLATERAL),
      );
    });
  });

  it('keeps SOV and BPRO in legacy collateral lists where needed for existing loans', () => {
    expect(
      LendingPoolDictionary.get(COMMON_SYMBOLS.BTC).getBorrowCollateral(),
    ).toEqual(expect.arrayContaining(DISABLED_COLLATERAL));
  });

  it('defines the expected active collateral per lending pool', () => {
    expect(
      LendingPoolDictionary.get(
        COMMON_SYMBOLS.DLLR,
      ).getActiveBorrowCollateral(),
    ).toEqual([COMMON_SYMBOLS.BTC]);
    expect(
      LendingPoolDictionary.get(COMMON_SYMBOLS.BTC).getActiveBorrowCollateral(),
    ).toEqual([COMMON_SYMBOLS.DLLR, COMMON_SYMBOLS.XUSD, COMMON_SYMBOLS.DOC]);
    expect(
      LendingPoolDictionary.get(
        COMMON_SYMBOLS.XUSD,
      ).getActiveBorrowCollateral(),
    ).toEqual([COMMON_SYMBOLS.BTC]);
    expect(
      LendingPoolDictionary.get(COMMON_SYMBOLS.DOC).getActiveBorrowCollateral(),
    ).toEqual([COMMON_SYMBOLS.BTC, COMMON_SYMBOLS.XUSD]);
    expect(
      LendingPoolDictionary.get(
        COMMON_SYMBOLS.RUSDT,
      ).getActiveBorrowCollateral(),
    ).toEqual([]);
    expect(
      LendingPoolDictionary.get('BPRO').getActiveBorrowCollateral(),
    ).toEqual([
      COMMON_SYMBOLS.DLLR,
      COMMON_SYMBOLS.BTC,
      COMMON_SYMBOLS.XUSD,
      COMMON_SYMBOLS.DOC,
    ]);
  });
});
