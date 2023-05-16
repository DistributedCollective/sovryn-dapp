import { ethers, providers } from 'ethers';

import { DEFAULT_SWAP_ROUTES } from '../../swaps/smart-router/config';
import { SmartRouter } from '../../swaps/smart-router/smart-router';
import { makeChainFixture } from '../_fixtures/chain';
import { SupportedTokens, getTokenContract } from '@sovryn/contracts';

describe('SmartRouter', () => {
  let router: SmartRouter;
  let provider: providers.Provider;
  let btc = ethers.constants.AddressZero;
  let xusd;
  let sov;
  let dllr;
  let zusd;

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

    it('returns two routes for DLLR to ZUSD swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(dllr, zusd),
      ).resolves.toHaveLength(2);
    });

    it('returns single route for DLLR to XUSD swap', async () => {
      await expect(
        router.getAvailableRoutesForAssets(dllr, xusd),
      ).resolves.toHaveLength(1);
    });
  });

  describe('getBestQuote', () => {
    it('get cheapest swap route for given assets', async () => {
      // todo:
    });
  });
});
