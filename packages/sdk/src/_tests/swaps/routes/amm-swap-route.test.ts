import { BigNumber, constants } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { parseUnits } from 'ethers/lib/utils';
import { ChainIds } from '@sovryn/ethers-provider';

import { ammSwapRoute } from '../../../swaps/smart-router/routes/amm-swap-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { makeTokenAddress } from '../../_fixtures/tokens';

describe('AMM Route', () => {
  let route: SwapRoute;
  let sov: string;
  let rbtc: string;
  let xusd: string;

  const AddressOne = '0x0000000000000000000000000000000000000001';

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = ammSwapRoute(fixture.provider);
    sov = await makeTokenAddress(SupportedTokens.sov, ChainIds.RSK_MAINNET);
    xusd = await makeTokenAddress(SupportedTokens.xusd, ChainIds.RSK_MAINNET);
    rbtc = await makeTokenAddress(SupportedTokens.rbtc, ChainIds.RSK_MAINNET);
  });

  it('has correct name', () => {
    expect(route.name).toEqual('AMM');
  });

  it('has pairs', async () => {
    const pairs = await route.pairs();
    expect(pairs.size).toBeGreaterThan(0);
  });

  describe('quote', () => {
    it('returns BigNumber for XUSD -> SOV quote', async () => {
      await expect(
        route.quote(xusd, sov, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('returns BigNumber for SOV -> XUSD quote', async () => {
      await expect(
        route.quote(sov, xusd, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('returns BigNumber for RBTC -> SOV quote', async () => {
      await expect(
        route.quote(rbtc, sov, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('returns BigNumber for SOV -> RBTC quote', async () => {
      await expect(
        route.quote(sov, rbtc, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('throws an ERR_INVALID_PATH error for unsupported pair', async () => {
      await expect(
        route.quote(AddressOne, xusd, constants.WeiPerEther),
      ).rejects.toThrowError(/ERR_INVALID_PATH/);
    });

    it('throws an ERR_INVALID_PATH for swap to itself', async () => {
      await expect(
        route.quote(xusd, xusd, constants.WeiPerEther),
      ).rejects.toThrowError(/ERR_INVALID_PATH/);
    });
  });

  describe('approve', () => {
    it('returns transaction request data for approval for ERC-20 tokens', async () => {
      await expect(
        route.approve(xusd, sov, constants.MaxInt256, constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
      });
    });

    it('returns undefined for approval tx request if entry token is RBTC', async () => {
      await expect(
        route.approve(rbtc, sov, constants.MaxInt256, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('permit', () => {
    it('returns undefined for permit function', async () => {
      await expect(
        route.permit(xusd, sov, constants.MaxInt256, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('swap', () => {
    it('build swap tx data for XUSD -> SOV', async () => {
      await expect(
        route.swap(xusd, sov, parseUnits('20'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('build swap tx data for SOV -> XUSD', async () => {
      await expect(
        route.swap(sov, xusd, parseUnits('20'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('build swap tx data for RBTC -> SOV', async () => {
      const amount = parseUnits('0.01');

      await expect(
        route.swap(rbtc, sov, amount, constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: amount.toString(),
      });
    });

    it('build swap tx data for SOV -> RBTC', async () => {
      await expect(
        route.swap(sov, rbtc, parseUnits('250'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });
  });
});
