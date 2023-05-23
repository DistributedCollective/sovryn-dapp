import { BigNumber, ethers, providers } from 'ethers';

import { SupportedTokens, getTokenContract } from '@sovryn/contracts';

import { DEFAULT_SWAP_ROUTES } from '../../swaps/smart-router/config';
import { SmartRouter } from '../../swaps/smart-router/smart-router';
import { makeChainFixture } from '../_fixtures/chain';

describe('SmartRouter', () => {
  let router: SmartRouter;
  let provider: providers.Provider;
  let btc = ethers.constants.AddressZero;
  let xusd, sov, dllr, zusd;

  beforeAll(async () => {
    provider = (await makeChainFixture()).provider;
    router = new SmartRouter(provider, DEFAULT_SWAP_ROUTES);

    xusd = (await getTokenContract(SupportedTokens.xusd)).address;
    sov = (await getTokenContract(SupportedTokens.sov)).address;
    dllr = (await getTokenContract(SupportedTokens.dllr)).address;
    zusd = (await getTokenContract(SupportedTokens.zusd)).address;
  });

  describe('getAvailableRoutes', () => {
    it('return all available routes', async () => {
      expect(router.getAvailableRoutes()).toHaveLength(2);
    });
  });

  describe('getAvailableRoutesForAssets', () => {
    it('returns single route for BTC to SOV swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(btc, sov),
      ).resolves.toHaveLength(1);
    });

    it('returns two routes for DLLR to XUSD swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(dllr, xusd),
      ).resolves.toHaveLength(1);
    });

    it('returns single route for DLLR to XUSD swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(dllr, xusd),
      ).resolves.toHaveLength(1);
    });
  });

  describe('getQuotes', () => {
    it('lists all quotes for XUSD -> SOV swap', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(router.getQuotes(xusd, sov, amount)).resolves.toHaveLength(
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
    it('get cheapest swap route for XUSD -> SOV', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(xusd, sov, amount),
      ).resolves.toMatchObject({
        quote: expect.any(BigNumber),
        route: expect.any(Object),
      });
    });

    it('get cheapest swap route for DLLR -> XUSD', async () => {
      const amount = ethers.utils.parseEther('20');
      await expect(
        router.getBestQuote(dllr, xusd, amount),
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
});
