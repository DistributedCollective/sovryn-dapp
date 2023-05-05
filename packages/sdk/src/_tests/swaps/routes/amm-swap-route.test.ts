import { BigNumber, constants } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';

import { ammSwapRoute } from '../../../swaps/smart-router/routes/amm-swap-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { makeTokenAddress } from '../../_fixtures/tokens';

describe('AMM Route', () => {
  let route: SwapRoute;
  let sov: string;
  let xusd: string;
  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = ammSwapRoute(fixture.provider);
    sov = await makeTokenAddress(SupportedTokens.sov, ChainIds.RSK_MAINNET);
    xusd = await makeTokenAddress(SupportedTokens.xusd, ChainIds.RSK_MAINNET);
  });

  it('has correct name', () => {
    expect(route.name).toEqual('AMM');
  });

  it('has pairs', async () => {
    const pairs = await route.pairs();
    expect(pairs.size).toBeGreaterThan(0);
  });

  it('returns BigNumber for supported pair', async () => {
    await expect(
      route.quote(xusd, sov, constants.WeiPerEther, 0),
    ).resolves.toBeInstanceOf(BigNumber);
  });

  it('throws an ERR_INVALID_PATH error for unsupported pair', async () => {
    await expect(
      route.quote(constants.AddressZero, xusd, constants.WeiPerEther, 0),
    ).rejects.toThrowError(/ERR_INVALID_PATH/);
  });

  it('throws an ERR_INVALID_PATH for swap to itself', async () => {
    await expect(
      route.quote(xusd, xusd, constants.WeiPerEther, 0),
    ).rejects.toThrowError(/ERR_INVALID_PATH/);
  });

  it('build approval tx data', async () => {
    // todo:
  });

  it('build swap tx data', async () => {
    // todo:
  });
});
