import { airSwapRoute } from '../../../swaps/smart-router/routes/air-swap-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { TEST_TIMEOUT } from '../../config';

describe('AIR Swap Route', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let route: SwapRoute;

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = airSwapRoute(fixture.provider);
  });

  it('has correct name', () => {
    expect(route.name).toEqual('AIR');
  });

  it('has pairs', async () => {
    const pairs = await route.pairs();
    expect(pairs.size).toBeGreaterThan(0);
  });
});
