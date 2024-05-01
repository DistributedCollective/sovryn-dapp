import { constants } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { myntBassetRoute } from '../../../swaps/smart-router/routes/mynt-basset-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { makeTokenAddress } from '../../_fixtures/tokens';
import { TEST_TIMEOUT } from '../../config';

describe('Mynt bAsset Route', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let route: SwapRoute;
  let rbtc: string;
  let dllr: string;
  let zusd: string;

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = myntBassetRoute(fixture.provider);
    rbtc = await makeTokenAddress('BTC');
    dllr = await makeTokenAddress('DLLR');
    zusd = await makeTokenAddress('ZUSD');
  });

  it('has correct name', () => {
    expect(route.name).toEqual('MyntBasset');
  });

  it('has pairs', async () => {
    const pairs = await route.pairs();
    expect(pairs.size).toBe(3);
  });

  describe('quote', () => {
    it('returns BigNumber for DDLR -> ZUSD quote', async () => {
      await expect(
        route.quote(dllr, zusd, constants.WeiPerEther),
      ).resolves.toBe(constants.WeiPerEther);
    });

    it('returns BigNumber for ZUSD -> DLLR quote', async () => {
      await expect(
        route.quote(zusd, dllr, constants.WeiPerEther),
      ).resolves.toBe(constants.WeiPerEther);
    });

    it('throws an Cannot swap error for unsupported pair', async () => {
      await expect(
        route.quote(rbtc, dllr, constants.WeiPerEther),
      ).rejects.toThrowError(/Cannot swap /);
    });
  });

  describe('approve', () => {
    it('returns transaction request data for approval for ERC-20 tokens', async () => {
      await expect(
        route.approve(zusd, dllr, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
      });
    });

    it('returns undefined for approval tx request if entry token is DLLR', async () => {
      await expect(
        route.approve(dllr, zusd, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('permit', () => {
    it('returns undefined for permit function', async () => {
      await expect(
        route.permit(dllr, zusd, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toBe(undefined);
    });
  });

  describe('swap', () => {
    it('builds swap tx data for DLLR -> ZUSD', async () => {
      await expect(
        route.swap(dllr, zusd, parseUnits('20'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('builds swap tx data for ZUSD -> DLLR', async () => {
      await expect(
        route.swap(zusd, dllr, parseUnits('20'), constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('fails build swap tx data for RBTC -> DLLR', async () => {
      const amount = parseUnits('0.01');

      await expect(
        route.swap(rbtc, dllr, amount, constants.AddressZero),
      ).rejects.toThrowError(/Cannot swap /);
    });
  });
});
