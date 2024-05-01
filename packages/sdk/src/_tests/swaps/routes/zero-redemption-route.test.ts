import { BigNumber, constants } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { zeroRedemptionSwapRoute } from '../../../swaps/smart-router/routes/zero-redemption-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { FAKE_PERMIT } from '../../_fixtures/permit';
import { makeTokenAddress } from '../../_fixtures/tokens';
import { TEST_TIMEOUT } from '../../config';

describe('Zero Redemption Route', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let route: SwapRoute;
  const rbtc = constants.AddressZero;
  let dllr: string;
  let zusd: string;

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = zeroRedemptionSwapRoute(fixture.provider);
    dllr = await makeTokenAddress('DLLR');
    zusd = await makeTokenAddress('ZUSD');
  });

  it('has correct name', () => {
    expect(route.name).toEqual('ZeroRedemption');
  });

  it('has pairs', async () => {
    const pairs = await route.pairs();
    expect(pairs.size).toBe(2);
  });

  describe('quote', () => {
    it('returns BigNumber for DDLR -> RBTC quote', async () => {
      await expect(
        route.quote(dllr, rbtc, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('returns BigNumber for ZUSD -> RBTC quote', async () => {
      await expect(
        route.quote(zusd, rbtc, constants.WeiPerEther),
      ).resolves.toBeInstanceOf(BigNumber);
    });

    it('throws an Cannot swap error for RBTC -> DLLR', async () => {
      await expect(
        route.quote(rbtc, dllr, constants.WeiPerEther),
      ).rejects.toThrowError(/Cannot swap /);
    });

    it('throws an Cannot swap error for RBTC -> ZUSD', async () => {
      await expect(
        route.quote(rbtc, zusd, constants.WeiPerEther),
      ).rejects.toThrowError(/Cannot swap /);
    });
  });

  describe('approve', () => {
    it('returns transaction request data for approval for ZUSD token', async () => {
      await expect(
        route.approve(zusd, rbtc, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
      });
    });

    it('returns undefined for approval tx request if entry token is DLLR', async () => {
      await expect(
        route.approve(dllr, rbtc, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toBe(undefined);
    });

    it('returns undefined for approval tx request if entry token is ZUSD and destination is not RBTC', async () => {
      await expect(
        route.approve(zusd, dllr, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('permit', () => {
    it('returns valid permit request for DLLR to RBTC swap', async () => {
      await expect(
        route.permit(dllr, rbtc, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toMatchObject({
        token: dllr,
        spender: expect.any(String),
        owner: constants.AddressZero,
        value: constants.WeiPerEther,
      });
    });

    it('returns undefined for permit function if entry token is ZUSD', async () => {
      await expect(
        route.permit(zusd, rbtc, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toBe(undefined);
    });

    it('returns undefined for permit function if entry token is DLLR and destination is not RBTC', async () => {
      await expect(
        route.permit(dllr, zusd, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('swap', () => {
    it('builds swap tx data for DLLR -> RBTC', async () => {
      await expect(
        route.swap(dllr, rbtc, parseUnits('20'), constants.AddressZero, {
          permit: FAKE_PERMIT,
        }),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('builds swap tx data for ZUSD -> RBTC', async () => {
      await expect(
        route.swap(zusd, rbtc, parseUnits('20'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('fails build swap tx data if permit is not provided for DLLR -> RBTC', async () => {
      await expect(
        route.swap(dllr, rbtc, parseUnits('20'), constants.AddressZero),
      ).rejects.toThrowError(/Permit is required for swap/);
    });

    it('fails build swap tx data for RBTC -> DLLR', async () => {
      const amount = parseUnits('0.01');

      await expect(
        route.swap(rbtc, dllr, amount, constants.AddressZero),
      ).rejects.toThrowError(/Cannot swap /);
    });

    it('fails build swap tx data for RBTC -> ZUSD', async () => {
      const amount = parseUnits('20');

      await expect(
        route.swap(rbtc, dllr, amount, constants.AddressZero),
      ).rejects.toThrowError(/Cannot swap /);
    });
  });
});
