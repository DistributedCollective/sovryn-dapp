import { BigNumber, constants, providers } from 'ethers';

import { DEFAULT_SWAP_SLIPPAGE } from '../../../constants';
import { getMinReturn } from '../../../internal/utils';
import { ambientRoute } from '../../../swaps/smart-router/routes/ambient';
import { SwapRoute } from '../../../swaps/smart-router/types';

const BOB_MAINNET_CHAIN_ID = 60808;

const mockTokenA = '0x00000000000000000000000000000000000000aa';
const mockTokenB = '0x00000000000000000000000000000000000000bb';
const mockZeroAddress = '0x0000000000000000000000000000000000000000';

// captures the slippage options handed to sdex's CrocEnv swap plans
const mockCapturedSlippages: number[] = [];

jest.mock('@sovryn/sdex', () => ({
  CrocEnv: jest.fn().mockImplementation(() => ({
    context: Promise.resolve({
      dex: { address: mockZeroAddress },
      chain: { proxyPaths: { long: 0 } },
    }),
    tokens: {
      materialize: () => ({ decimals: 18 }),
    },
    sell: () => ({
      for: (_destination: string, opts: { slippage?: number }) => {
        if (opts.slippage !== undefined) {
          mockCapturedSlippages.push(opts.slippage);
        }
        return {
          generateSwapData: async () => ({
            to: mockZeroAddress,
            data: '0x',
            value: '0',
          }),
        };
      },
    }),
  })),
}));

jest.mock('../../../swaps/smart-router/utils/ambient-utils', () => ({
  ...jest.requireActual('../../../swaps/smart-router/utils/ambient-utils'),
  fetchPools: async () => [[mockTokenA, mockTokenB, 400]],
}));

describe('Ambient route slippage encoding', () => {
  let route: SwapRoute;

  const provider = {
    getNetwork: async () => ({ chainId: BOB_MAINNET_CHAIN_ID }),
  } as providers.Provider;

  const swapWithSlippage = async (slippage?: number) => {
    mockCapturedSlippages.length = 0;
    await route.swap(
      mockTokenA,
      mockTokenB,
      constants.WeiPerEther,
      constants.AddressZero,
      slippage !== undefined ? { slippage } : undefined,
    );
    expect(mockCapturedSlippages).toHaveLength(1);
    return mockCapturedSlippages[0];
  };

  beforeEach(() => {
    route = ambientRoute(provider);
  });

  it('encodes basis points as the fraction sdex expects (50 bps -> 0.005)', async () => {
    const fraction = await swapWithSlippage(50);
    expect(fraction).toBeCloseTo(0.005, 10);
  });

  it('defaults to DEFAULT_SWAP_SLIPPAGE when no slippage option is given', async () => {
    const fraction = await swapWithSlippage();
    expect(fraction).toBeCloseTo(DEFAULT_SWAP_SLIPPAGE / 10000, 10);
  });

  it('matches getMinReturn basis-point semantics across tolerance values', async () => {
    for (const bps of [10, 50, 100, 1000]) {
      const fraction = await swapWithSlippage(bps);

      const minReturn = getMinReturn(constants.WeiPerEther, bps);
      const impliedMinReturn = BigNumber.from(
        BigInt(Math.round((1 - fraction) * 1e18)).toString(),
      );

      expect(impliedMinReturn.toString()).toEqual(minReturn.toString());
    }
  });
});
