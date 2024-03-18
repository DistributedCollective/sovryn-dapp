import { BigNumber, constants } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { ammSwapRoute } from '../../../swaps/smart-router/routes/amm-swap-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { makeTokenAddress } from '../../_fixtures/tokens';
import { TEST_TIMEOUT } from '../../config';

describe('AMM Route', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let route: SwapRoute;
  let sov: string;
  let rbtc: string;
  let dllr: string;

  const AddressOne = '0x0000000000000000000000000000000000000001';

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = ammSwapRoute(fixture.provider);
    sov = await makeTokenAddress('SOV');
    dllr = await makeTokenAddress('DLLR');
    rbtc = await makeTokenAddress('BTC');
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
        route.quote(dllr, sov, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('returns BigNumber for SOV -> XUSD quote', async () => {
      await expect(
        route.quote(sov, dllr, constants.WeiPerEther),
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
        route.quote(AddressOne, dllr, constants.WeiPerEther),
      ).rejects.toThrowError(/ERR_INVALID_PATH/);
    });

    it('throws an ERR_INVALID_PATH for swap to itself', async () => {
      await expect(
        route.quote(dllr, dllr, constants.WeiPerEther),
      ).rejects.toThrowError(/ERR_INVALID_PATH/);
    });
  });

  describe('approve', () => {
    it('returns transaction request data for approval for ERC-20 tokens', async () => {
      await expect(
        route.approve(dllr, sov, constants.MaxInt256, constants.AddressZero),
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
        route.permit(dllr, sov, constants.MaxInt256, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('swap', () => {
    it('build swap tx data for DLLR -> SOV', async () => {
      await expect(
        route.swap(dllr, sov, parseUnits('20'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('build swap tx data for SOV -> DLLR', async () => {
      await expect(
        route.swap(sov, dllr, parseUnits('20'), constants.AddressZero),
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
