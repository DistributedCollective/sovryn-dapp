import { BigNumber, ethers, providers } from 'ethers';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';

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

  beforeAll(async () => {
    provider = (await makeChainFixture()).provider;
    router = new SmartRouter(provider, Object.values(smartRoutes));

    xusd = (await getTokenContract(SupportedTokens.xusd)).address;
    sov = (await getTokenContract(SupportedTokens.sov)).address;
    dllr = (await getTokenContract(SupportedTokens.dllr)).address;
    zusd = (await getTokenContract(SupportedTokens.zusd)).address;
  });

  describe('getAvailableRoutes', () => {
    it('return all available routes', async () => {
      expect(router.getAvailableRoutes()).toHaveLength(4);
    });
  });

  describe('getAvailableRoutesForAssets', () => {
    it('returns single route for BTC to SOV swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(btc, sov),
      ).resolves.toHaveLength(1);
    });

    it('returns two routes for DLLR to RBTC swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(dllr, btc),
      ).resolves.toHaveLength(3);
    });

    it('returns no routes for DLLR to XUSD swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(dllr, xusd),
      ).resolves.toHaveLength(0);
    });
  });

  describe('getQuotes', () => {
    it('lists all quotes for DLLR -> SOV swap', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(router.getQuotes(dllr, sov, amount)).resolves.toHaveLength(
        1,
      );
    });

    it('lists all quotes for DLLR -> ZUSD swap', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(router.getQuotes(dllr, zusd, amount)).resolves.toHaveLength(
        1,
      );
    });
  });

  describe('getBestQuote', () => {
    it('get cheapest swap route for DLLR -> SOV', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(dllr, sov, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for DLLR -> ZUSD', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(dllr, zusd, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for DLLR -> BTC', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(dllr, btc, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for BTC -> DLLR', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(dllr, btc, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });
  });

  describe('helpers', () => {
    it('returns all available pairs on enabled routes', async () => {
      await expect(router.getPairs()).resolves.toBeInstanceOf(Map);
    });

    it('returns all available entries', async () => {
      await expect(router.getEntries()).resolves.toHaveLength(9);
    });

    it('returns all available destinations for entry token', async () => {
      await expect(router.getDestination(sov)).resolves.toHaveLength(6);
    });

    it('returns data about token', async () => {
      await expect(router.getTokenDetails(btc)).resolves.toMatchObject({
        address: btc,
        symbol: 'rbtc',
        decimalPrecision: 18,
        icon: expect.any(String),
        abi: expect.any(Array),
      });
    });
  });
});
