import { BigNumber, constants, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { getAssetContract, getProtocolContract } from '@sovryn/contracts';

import { mocIntegrationSwapRoute } from '../../../swaps/smart-router/routes/moc-integration-swap-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import {
  FAKE_PERMIT_TRANSFER_FROM,
  FAKE_SIGNATURE,
} from '../../_fixtures/permit';
import { makeTokenAddress } from '../../_fixtures/tokens';
import { TEST_TIMEOUT } from '../../config';

describe('Moc Integration Route', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let route: SwapRoute;
  const rbtc = constants.AddressZero;
  let dllr: string;
  let moc: string;
  let masset: string;
  let doc: Contract;
  let balance: BigNumber = constants.WeiPerEther;

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = mocIntegrationSwapRoute(fixture.provider);
    dllr = await makeTokenAddress('DLLR');
    moc = await makeTokenAddress('MOC');
    masset = (await getProtocolContract('massetManager')).address;
    const { address, abi } = await getAssetContract('DOC');
    doc = new Contract(address, abi, fixture.provider);

    balance = await doc.balanceOf(masset);
  });

  it('has correct name', () => {
    expect(route.name).toEqual('MocIntegration');
  });

  it('has pairs', async () => {
    const pairs = await route.pairs();
    expect(pairs.size).toBe(1);
  });

  describe('quote', () => {
    it('returns BigNumber for DDLR -> RBTC quote', async () => {
      await expect(route.quote(dllr, rbtc, balance)).resolves.toBeInstanceOf(
        BigNumber,
      );
    });

    it('throws when masset balance is too low for DDLR -> RBTC swap', async () => {
      await expect(
        route.quote(dllr, rbtc, balance.add(1)),
      ).rejects.toThrowError(/Not enough DOC in the system./);
    });

    it('throws a Cannot swap error for RBTC -> DLLR', async () => {
      await expect(
        route.quote(rbtc, dllr, constants.WeiPerEther),
      ).rejects.toThrowError(/Cannot swap /);
    });

    it('throws a Cannot swap error for RBTC -> ZUSD', async () => {
      await expect(
        route.quote(rbtc, moc, constants.WeiPerEther),
      ).rejects.toThrowError(/Cannot swap /);
    });
  });

  describe('approve', () => {
    it('returns data for approval tx request', async () => {
      await expect(
        route.approve(dllr, rbtc, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
      });
    });
  });

  describe('permit', () => {
    it('returns undefined for permit function', async () => {
      await expect(
        route.permit(moc, rbtc, constants.WeiPerEther, constants.AddressZero),
      ).resolves.toMatchObject({
        approvalRequired: true,
        typedData: expect.objectContaining({
          domain: expect.any(Object),
          types: expect.any(Object),
          values: expect.any(Object),
        }),
      });
    });
  });

  describe('swap', () => {
    it('builds swap tx data for DLLR -> RBTC', async () => {
      await expect(
        route.swap(dllr, rbtc, parseUnits('20'), constants.AddressZero, {
          typedDataValue: FAKE_PERMIT_TRANSFER_FROM,
          typedDataSignature: FAKE_SIGNATURE,
        }),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
        value: '0',
      });
    });

    it('fails build swap tx data if permitTransferFrom is not provided', async () => {
      await expect(
        route.swap(dllr, rbtc, parseUnits('20'), constants.AddressZero),
      ).rejects.toThrowError(/Permit2 is required for swap/);
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
