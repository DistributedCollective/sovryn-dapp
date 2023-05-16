import { providers } from 'ethers';

import { DEFAULT_SWAP_ROUTES } from '../../swaps/smart-router/config';
import { SmartRouter } from '../../swaps/smart-router/smart-router';
import { makeChainFixture } from '../_fixtures/chain';

describe('SmartRouter', () => {
  let router: SmartRouter;
  let provider: providers.Provider;

  beforeAll(async () => {
    provider = (await makeChainFixture()).provider;
    router = new SmartRouter(provider, DEFAULT_SWAP_ROUTES);
  });

  it('return all available routes', async () => {
    expect(router.getAvailableRoutes()).toHaveLength(2);
  });

  it('return available routes for given assets', async () => {
    // todo:
  });

  it('get cheapest swap route for given assets', async () => {
    // todo:
  });
});
