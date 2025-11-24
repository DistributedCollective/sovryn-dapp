import { BigNumber, ethers, providers } from 'ethers';

import { getAssetContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { smartRoutes } from '../../swaps/smart-router';
import { SmartRouter } from '../../swaps/smart-router/smart-router';
import { makeChainFixture } from '../_fixtures/chain';
import { TEST_TIMEOUT } from '../config';

describe('SmartRouter', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let router: SmartRouter;
  let provider: providers.Provider;
  let btc = ethers.constants.AddressZero;
  let xusd, sov, dllr, zusd;
  const chainId = ChainIds.RSK_MAINNET;

  beforeAll(async () => {
    provider = (await makeChainFixture()).provider;
    router = new SmartRouter(provider, Object.values(smartRoutes));

    xusd = (await getAssetContract('XUSD')).address;
    sov = (await getAssetContract('SOV')).address;
    dllr = (await getAssetContract('DLLR')).address;
    zusd = (await getAssetContract('ZUSD')).address;
  });

  describe('getAvailableRoutes', () => {
    it('return all available routes', async () => {
      expect(router.getAvailableRoutes(chainId)).toHaveLength(5);
    });
  });

  describe('getAvailableRoutesForAssets', () => {
    it('returns single route for BTC to SOV swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(chainId, btc, sov),
      ).resolves.toHaveLength(1);
    });

    it('returns two routes for DLLR to RBTC swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(chainId, dllr, btc),
      ).resolves.toHaveLength(3);
    });

    it('returns 0 routes for DLLR to XUSD swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(chainId, dllr, xusd),
      ).resolves.toHaveLength(0);
    });
  });

  describe('getQuotes', () => {
    it('lists all quotes for DLLR -> SOV swap', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getQuotes(chainId, dllr, sov, amount),
      ).resolves.toHaveLength(1);
    });

    it('lists all quotes for DLLR -> ZUSD swap', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getQuotes(chainId, dllr, zusd, amount),
      ).resolves.toHaveLength(1);
    });
  });

  describe('getBestQuote', () => {
    it('get cheapest swap route for DLLR -> SOV', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(chainId, dllr, sov, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for DLLR -> ZUSD', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(chainId, dllr, zusd, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for DLLR -> BTC', async () => {
      const amount = ethers.utils.parseEther('0.01');
      await expect(
        router.getBestQuote(chainId, dllr, btc, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for BTC -> DLLR', async () => {
      const amount = ethers.utils.parseEther('0.01');
      await expect(
        router.getBestQuote(chainId, dllr, btc, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });
  });

  describe('helpers', () => {
    it('returns all available pairs on enabled routes', async () => {
      await expect(router.getPairs(chainId)).resolves.toBeInstanceOf(Map);
    });

    it('returns all available entries', async () => {
      await expect(router.getEntries(chainId)).resolves.toHaveLength(17);
    });

    it('returns all available destinations for entry token', async () => {
      await expect(router.getDestination(chainId, sov)).resolves.toHaveLength(
        15,
      );
    });

    it('returns data about token', async () => {
      await expect(router.getTokenDetails(btc, chainId)).resolves.toMatchObject(
        {
          address: btc,
          symbol: 'BTC',
          decimals: 18,
          isNative: true,
          icon: expect.any(String),
          abi: expect.any(Array),
        },
      );
    });
  });
});
