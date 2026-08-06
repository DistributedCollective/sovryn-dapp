import { BigNumber, constants, providers } from 'ethers';

import { OrderDirective } from '@sovryn/sdex/dist/encoding/longform';

import { getMinReturn } from '../../../internal/utils';
import { ambientRoute } from '../../../swaps/smart-router/routes/ambient';
import { SwapRoute } from '../../../swaps/smart-router/types';

const BOB_MAINNET_CHAIN_ID = 60808;

const mockTokenA = '0x00000000000000000000000000000000000000aa';
const mockTokenB = '0x00000000000000000000000000000000000000bb';
// sorts below A and B so the second hop of A -> B -> C is a sell leg
const mockTokenC = '0x0000000000000000000000000000000000000011';
const mockZeroAddress = '0x0000000000000000000000000000000000000000';

// Q64.64 sqrt price of 1.0, i.e. 2^64
const mockUnitSqrtPrice = '18446744073709551616';

// pools returned by the mocked indexer; tests may override per case
let mockPools: [string, string, number][] = [[mockTokenA, mockTokenB, 400]];

// captures the slippage options handed to sdex's CrocEnv swap plans
const mockCapturedSlippages: number[] = [];

jest.mock('@sovryn/sdex', () => ({
  CrocEnv: jest.fn().mockImplementation(() => ({
    context: Promise.resolve({
      dex: {
        address: mockZeroAddress,
        interface: { encodeFunctionData: () => '0x' },
      },
      chain: { proxyPaths: { long: 130 } },
    }),
    tokens: {
      materialize: () => ({ decimals: 18 }),
    },
    pool: async (tokenA: string, tokenB: string, poolIndex: number) => {
      const [base, quote] =
        tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
      return {
        baseToken: { tokenAddr: base },
        quoteToken: { tokenAddr: quote },
        poolIndex,
      };
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
  fetchPools: async () => mockPools,
  calcImpact: async () => ({
    finalPrice: mockUnitSqrtPrice,
    baseFlow: '1000000000000000000',
    quoteFlow: '-1000000000000000000',
  }),
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
    mockPools = [[mockTokenA, mockTokenB, 400]];
    route = ambientRoute(provider);
  });

  it('encodes basis points as the fraction sdex expects (50 bps -> 0.005)', async () => {
    const fraction = await swapWithSlippage(50);
    expect(fraction).toBeCloseTo(0.005, 10);
  });

  it('defaults to 50 bps (0.5%, the UI preset) when no slippage option is given', async () => {
    const fraction = await swapWithSlippage();
    expect(fraction).toBeCloseTo(0.005, 10);
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

  it('bounds each multi-hop pool sqrt price by the same fraction (50 bps -> 1 +/- 0.005)', async () => {
    mockPools = [
      [mockTokenA, mockTokenB, 400],
      [mockTokenC, mockTokenB, 410],
    ];
    route = ambientRoute(provider);

    const appendPoolSpy = jest.spyOn(OrderDirective.prototype, 'appendPool');

    // no direct A/C pool -> long-form multi-hop path A -> B -> C
    await route.swap(
      mockTokenA,
      mockTokenC,
      constants.WeiPerEther,
      constants.AddressZero,
      { slippage: 50 },
    );

    const orderPools = appendPoolSpy.mock.results.map(result => result.value);
    appendPoolSpy.mockRestore();
    expect(orderPools).toHaveLength(2);

    // calcImpact is mocked to a sqrt price of exactly 1.0 (2^64), so the
    // encoded limitPrice ratio is the applied sqrt-price slippage bound
    const boundRatios = orderPools.map(
      pool => Number(pool.swap.limitPrice.toString()) / 2 ** 64,
    );

    // first hop buys (entry is base), second hop sells (entry is quote)
    expect(boundRatios[0]).toBeCloseTo(1.005, 6);
    expect(boundRatios[1]).toBeCloseTo(0.995, 6);
  });
});
