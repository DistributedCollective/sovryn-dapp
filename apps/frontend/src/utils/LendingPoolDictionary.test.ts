import { LendingPoolDictionary } from './LendingPoolDictionary';
import { COMMON_SYMBOLS } from './asset';

const ASSETS = ['BPRO', 'BTC', 'DLLR', 'DOC', 'RUSDT', 'SOV', 'XUSD'];

jest.mock(
  '@sovryn/contracts',
  () => ({
    contracts: {
      assets: {
        rsk: ASSETS.map(symbol => ({ symbol })),
      },
    },
  }),
  { virtual: true },
);

jest.mock(
  '@sovryn/ethers-provider',
  () => ({
    __esModule: true,
    default: jest.fn(),
    ChainIds: {
      BOB_MAINNET: 60808,
      BOB_TESTNET: 808813,
      BSC_MAINNET: 56,
      BSC_TESTNET: 97,
      FORK: 31337,
      MAINNET: 1,
      RSK_MAINNET: 30,
      RSK_TESTNET: 31,
      SEPOLIA: 11155111,
    },
    getNetworkByChainId: jest.fn(() => 'rsk'),
  }),
  { virtual: true },
);

jest.mock(
  '@sovryn/sdk',
  () => ({
    INDEXER_URL: '',
    INDEXER_URL_STAGING: '',
    INDEXER_URL_TESTNET: '',
  }),
  { virtual: true },
);

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
