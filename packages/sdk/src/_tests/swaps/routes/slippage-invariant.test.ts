import { BigNumber, constants, providers, utils } from 'ethers';

import { getAssetContract, getProtocolContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { getMinReturn } from '../../../internal/utils';
import { DEFAULT_SWAP_ROUTES, smartRoutes } from '../../../swaps/smart-router';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { FAKE_SIGNATURE } from '../../_fixtures/permit';

/**
 * Cross-route slippage invariant (regression guard for GHSA-jx33-xg6c-px39).
 *
 * `options.slippage` crosses every `route.swap()` in basis points
 * (10_000 = 100%, see `getMinReturn` and `DEFAULT_SWAP_SLIPPAGE`). The Ambient
 * route once divided by 1_000 instead of 10_000, silently encoding a 10x
 * looser min-out bound. This suite pins what each route in the shipped route
 * set derives FROM that shared bps input:
 *
 * - AMM and Ambient are the only routes that consume `options.slippage`.
 *   For a fixed tolerance both must derive the same effective min-out
 *   fraction, 1 - bps / 10_000 (within rounding). Ambient's sdex layer
 *   legitimately works with fractions internally (it is a standalone protocol
 *   with its own conventions) — the invariant is about the bps -> fraction
 *   conversion at the route boundary, not about unifying conventions.
 * - MyntBasset, MyntFixedRate and MocIntegration ignore the slippage option
 *   entirely (1:1 or fixed-rate conversions); the suite pins that no
 *   slippage-derived quantity exists in their calldata, so there is no unit
 *   conversion that could silently diverge.
 * - ZeroRedemption builds its transactions through @sovryn-zero/lib-ethers,
 *   which needs live Liquity chain state (fees, hints, block-polled store),
 *   so its swap() cannot be exercised end-to-end without a live chain.
 *   Instead the lib boundary is mocked and the suite pins that the route
 *   passes no bps-derived value across it: `maxRedemptionRate` stays
 *   undefined no matter what slippage option is given (Zero's redemption-fee
 *   tolerance comes from protocol fees in quote(), not from the bps input).
 *
 * Everything runs against fake providers / mocked protocol boundaries —
 * no network access (same idiom as ambient-route.test.ts).
 */

const TOLERANCE_BPS = 50; // 0.5%
const EXPECTED_MIN_OUT_FRACTION = 1 - TOLERANCE_BPS / 10_000; // 0.995

const RSK_CHAIN_ID = 30;
const BOB_CHAIN_ID = 60808;

const mockTokenA = '0x00000000000000000000000000000000000000aa';
const mockTokenB = '0x00000000000000000000000000000000000000bb';

// pools returned by the mocked Ambient indexer
const mockAmbientPools: [string, string, number][] = [
  [mockTokenA, mockTokenB, 400],
];

// captures the slippage fractions handed to sdex's CrocEnv swap plans
const mockAmbientSlippages: number[] = [];

jest.mock('@sovryn/sdex', () => ({
  CrocEnv: jest.fn().mockImplementation(() => ({
    tokens: {
      materialize: () => ({ decimals: 18 }),
    },
    sell: () => ({
      for: (_destination: string, opts: { slippage?: number }) => {
        if (opts.slippage !== undefined) {
          mockAmbientSlippages.push(opts.slippage);
        }
        return {
          generateSwapData: async () => ({
            to: '0x0000000000000000000000000000000000000000',
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
  fetchPools: async () => mockAmbientPools,
}));

// captures the (amount, maxRedemptionRate, overrides) tuples the Zero route
// hands to @sovryn-zero/lib-ethers
const mockRedeemZusdCalls: unknown[][] = [];

jest.mock('@sovryn-zero/lib-ethers', () => ({
  ReadableEthersLiquity: { connect: async () => ({}) },
  EthersLiquity: jest.fn(),
  PopulatableEthersLiquity: jest.fn().mockImplementation(() => ({
    redeemZUSD: async (...args: unknown[]) => {
      mockRedeemZusdCalls.push(args);
      return {
        rawPopulatedTransaction: {
          to: '0x0000000000000000000000000000000000000001',
          data: '0x',
        },
      };
    },
  })),
}));

// Minimal provider stub: enough for routes that only need the chain id and
// (optionally) a single eth_call answered locally. `_isProvider` satisfies
// ethers' Provider.isProvider check when routes construct Contract instances.
const makeFakeProvider = (
  chainId: number,
  call?: (tx: { to?: string; data?: string }) => Promise<string>,
): providers.Provider =>
  ({
    _isProvider: true,
    getNetwork: async () => ({ chainId, name: 'test' }),
    call:
      call ??
      (async () => {
        throw new Error('unexpected eth_call in offline slippage test');
      }),
  } as unknown as providers.Provider);

describe('cross-route slippage invariant', () => {
  jest.setTimeout(30_000);

  let dllr: string;
  let sov: string;
  let zusd: string;
  let mynt: string;
  let swapNetworkIface: utils.Interface;
  let massetManagerIface: utils.Interface;
  let fixedRateIface: utils.Interface;
  let mocIntegrationIface: utils.Interface;

  beforeAll(async () => {
    const chain = ChainIds.RSK_MAINNET;
    dllr = (await getAssetContract('DLLR', chain)).address.toLowerCase();
    sov = (await getAssetContract('SOV', chain)).address.toLowerCase();
    zusd = (await getAssetContract('ZUSD', chain)).address.toLowerCase();
    mynt = (await getAssetContract('MYNT', chain)).address.toLowerCase();
    swapNetworkIface = new utils.Interface(
      (await getProtocolContract('swapNetwork', chain)).abi,
    );
    massetManagerIface = new utils.Interface(
      (await getProtocolContract('massetManager', chain)).abi,
    );
    fixedRateIface = new utils.Interface(
      (await getProtocolContract('fixedRateMynt', chain)).abi,
    );
    mocIntegrationIface = new utils.Interface(
      (await getProtocolContract('mocIntegrationProxy', chain)).abi,
    );
  });

  describe('route set coverage', () => {
    it('accounts for every route in the shipped route set', () => {
      // If this fails, a route was added or removed: extend (or prune) this
      // suite so the new route's slippage handling is pinned as well.
      expect(Object.keys(smartRoutes).sort()).toEqual([
        'ambientRoute',
        'ammSwapRoute',
        'mocIntegrationSwapRoute',
        'myntBassetRoute',
        'myntFixedRateRoute',
        'zeroRedemptionSwapRoute',
      ]);
      expect(DEFAULT_SWAP_ROUTES).toHaveLength(4);
    });

    it('shared helper getMinReturn treats slippage as basis points of 10_000', () => {
      expect(
        getMinReturn(constants.WeiPerEther, TOLERANCE_BPS).toString(),
      ).toEqual(utils.parseEther('0.995').toString());
      // 10_000 bps = 100% slippage tolerance = zero min return
      expect(getMinReturn(constants.WeiPerEther, 10_000).isZero()).toBe(true);
      // default is DEFAULT_SWAP_SLIPPAGE = 100 bps = 1%
      expect(getMinReturn(constants.WeiPerEther).toString()).toEqual(
        utils.parseEther('0.99').toString(),
      );
    });
  });

  // AMM route: swap() quotes the expected return, then encodes
  // convertByPath(..., minReturn = getMinReturn(quote, slippage), ...).
  // The quote itself is stubbed to 1e18 so the encoded minReturn directly
  // exposes the min-out fraction the route derived from the bps input; the
  // only remaining eth_call (conversionPath) is answered locally.
  const deriveAmmMinOutFraction = async (slippageBps: number) => {
    const conversionPathSighash = swapNetworkIface.getSighash('conversionPath');
    const provider = makeFakeProvider(RSK_CHAIN_ID, async tx => {
      if (!tx.data?.startsWith(conversionPathSighash)) {
        throw new Error(`unexpected eth_call: ${tx.data}`);
      }
      return swapNetworkIface.encodeFunctionResult('conversionPath', [
        [dllr, sov],
      ]);
    });

    const route: SwapRoute = smartRoutes.ammSwapRoute(provider);
    const quote = constants.WeiPerEther;
    route.quote = async () => quote;

    const tx = await route.swap(dllr, sov, quote, constants.AddressZero, {
      slippage: slippageBps,
    });

    const decoded = swapNetworkIface.decodeFunctionData(
      'convertByPath',
      tx.data as string,
    );

    // slippage must only tighten the return leg, never scale the input
    expect(decoded._amount.toString()).toEqual(quote.toString());

    return {
      minReturn: decoded._minReturn as BigNumber,
      quote,
      fraction: Number(decoded._minReturn.toString()) / 1e18,
    };
  };

  // Ambient route: swap() converts the bps input to the fraction sdex expects
  // and hands it to the CrocEnv swap plan; the mocked plan captures it.
  // (Multi-hop sqrt-price bounds are pinned in ambient-route.test.ts.)
  const deriveAmbientMinOutFraction = async (slippageBps: number) => {
    mockAmbientSlippages.length = 0;
    const route = smartRoutes.ambientRoute(makeFakeProvider(BOB_CHAIN_ID));

    await route.swap(
      mockTokenA,
      mockTokenB,
      constants.WeiPerEther,
      constants.AddressZero,
      { slippage: slippageBps },
    );

    expect(mockAmbientSlippages).toHaveLength(1);
    return { fraction: 1 - mockAmbientSlippages[0] };
  };

  describe('routes deriving a bound from the bps input (AMM, Ambient)', () => {
    it('AMM encodes minReturn = getMinReturn(quote, bps) exactly', async () => {
      const { minReturn, quote } = await deriveAmmMinOutFraction(TOLERANCE_BPS);
      expect(minReturn.toString()).toEqual(
        getMinReturn(quote, TOLERANCE_BPS).toString(),
      );
    });

    it('both derive the same effective min-out fraction from 50 bps', async () => {
      const amm = await deriveAmmMinOutFraction(TOLERANCE_BPS);
      const ambient = await deriveAmbientMinOutFraction(TOLERANCE_BPS);

      expect(amm.fraction).toBeCloseTo(EXPECTED_MIN_OUT_FRACTION, 12);
      expect(ambient.fraction).toBeCloseTo(EXPECTED_MIN_OUT_FRACTION, 12);
      expect(amm.fraction).toBeCloseTo(ambient.fraction, 12);
    });

    it('stays in lockstep across the whole tolerance range', async () => {
      for (const bps of [10, 50, 100, 1000]) {
        const amm = await deriveAmmMinOutFraction(bps);
        const ambient = await deriveAmbientMinOutFraction(bps);
        const expected = 1 - bps / 10_000;

        expect(amm.fraction).toBeCloseTo(expected, 12);
        expect(ambient.fraction).toBeCloseTo(expected, 12);
        // the GHSA-jx33-xg6c-px39 bug made these differ by ~9x at 50 bps
        expect(amm.fraction).toBeCloseTo(ambient.fraction, 12);
      }
    });
  });

  describe('routes that must not consume the bps input', () => {
    // Build the same swap with wildly different slippage options; a route
    // that ignores slippage must produce bit-identical calldata, proving no
    // bps-derived quantity (and thus no conversion to get wrong) exists.
    const SLIPPAGE_VARIANTS: (number | undefined)[] = [
      undefined,
      TOLERANCE_BPS,
      9999,
    ];

    const buildAcrossSlippages = async (
      makeRoute: () => SwapRoute,
      entry: string,
      destination: string,
      amount: BigNumber,
      baseOptions?: Record<string, unknown>,
    ) => {
      const results: providers.TransactionRequest[] = [];
      for (const slippage of SLIPPAGE_VARIANTS) {
        const route = makeRoute();
        // populate the routes' internal chainId caches, as the smart router
        // does before ever calling swap()
        await route.pairs();
        const options =
          slippage === undefined
            ? baseOptions
            : { ...(baseOptions ?? {}), slippage };
        results.push(
          await route.swap(
            entry,
            destination,
            amount,
            constants.AddressZero,
            options,
          ),
        );
      }
      return results;
    };

    it('MyntBasset ignores slippage and forwards the full amount 1:1', async () => {
      const amount = constants.WeiPerEther;
      const txs = await buildAcrossSlippages(
        () => smartRoutes.myntBassetRoute(makeFakeProvider(RSK_CHAIN_ID)),
        dllr,
        zusd,
        amount,
      );

      expect(txs[1]).toEqual(txs[0]);
      expect(txs[2]).toEqual(txs[0]);

      const decoded = massetManagerIface.decodeFunctionData(
        'redeemTo',
        txs[0].data as string,
      );
      expect(decoded._massetQuantity.toString()).toEqual(amount.toString());
    });

    it('MyntFixedRate ignores slippage and converts the full amount', async () => {
      const amount = constants.WeiPerEther;
      const txs = await buildAcrossSlippages(
        () => smartRoutes.myntFixedRateRoute(makeFakeProvider(RSK_CHAIN_ID)),
        mynt,
        sov,
        amount,
      );

      expect(txs[1]).toEqual(txs[0]);
      expect(txs[2]).toEqual(txs[0]);

      const decoded = fixedRateIface.decodeFunctionData(
        'convert',
        txs[0].data as string,
      );
      expect(decoded._myntAmount.toString()).toEqual(amount.toString());
    });

    it('MocIntegration ignores slippage and only encodes the permit', async () => {
      const amount = constants.WeiPerEther;
      const typedDataValue = {
        permitted: { token: dllr, amount: amount.toString() },
        nonce: 1,
        deadline: 2_000_000_000,
      };
      // a well-formed canonical signature — the moc route canonicalizes
      // signatures and rejects malformed ones at build time
      const typedDataSignature = FAKE_SIGNATURE;

      const txs = await buildAcrossSlippages(
        () =>
          smartRoutes.mocIntegrationSwapRoute(makeFakeProvider(RSK_CHAIN_ID)),
        dllr,
        constants.AddressZero,
        amount,
        { typedDataValue, typedDataSignature },
      );

      expect(txs[1]).toEqual(txs[0]);
      expect(txs[2]).toEqual(txs[0]);

      const decoded = mocIntegrationIface.decodeFunctionData(
        'getDocFromDllrAndRedeemRbtcWithPermit2',
        txs[0].data as string,
      );
      expect(decoded.permit.permitted.amount.toString()).toEqual(
        amount.toString(),
      );
    });

    it('ZeroRedemption passes no bps-derived tolerance to lib-ethers', async () => {
      // swap() cannot run against a real chain here (lib-ethers needs live
      // Liquity fees/hints/store state), so the lib boundary is mocked and we
      // pin what crosses it: the full amount and an undefined
      // maxRedemptionRate, independent of the slippage option.
      const amount = constants.WeiPerEther;
      mockRedeemZusdCalls.length = 0;

      for (const slippage of SLIPPAGE_VARIANTS) {
        const route = smartRoutes.zeroRedemptionSwapRoute(
          makeFakeProvider(RSK_CHAIN_ID),
        );
        await route.pairs();
        await route.swap(
          zusd,
          constants.AddressZero,
          amount,
          constants.AddressZero,
          slippage === undefined ? undefined : { slippage },
        );
      }

      expect(mockRedeemZusdCalls).toHaveLength(SLIPPAGE_VARIANTS.length);
      for (const [redeemAmount, maxRedemptionRate] of mockRedeemZusdCalls) {
        expect(String(redeemAmount)).toEqual('1');
        expect(maxRedemptionRate).toBeUndefined();
      }
    });
  });
});
