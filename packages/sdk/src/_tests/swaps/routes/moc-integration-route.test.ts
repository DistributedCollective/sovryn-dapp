import { BigNumber, constants, Contract } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';

import { mocIntegrationSwapRoute } from '../../../swaps/smart-router/routes/moc-integration-swap-route';
import { SwapRoute } from '../../../swaps/smart-router/types';
import { makeChainFixture } from '../../_fixtures/chain';
import { FAKE_PERMIT } from '../../_fixtures/permit';
import { makeTokenAddress } from '../../_fixtures/tokens';
import { TEST_TIMEOUT } from '../../config';

describe('Moc Integration Route', () => {
  jest.setTimeout(TEST_TIMEOUT);

  let route: SwapRoute;
  const rbtc = constants.AddressZero;
  let dllr: string;
  let moc: string;
  // let mocIntegration: string;
  let masset: string;
  let doc: Contract;
  let balance: BigNumber = constants.WeiPerEther;

  beforeAll(async () => {
    const fixture = await makeChainFixture();
    route = mocIntegrationSwapRoute(fixture.provider);
    dllr = await makeTokenAddress(SupportedTokens.dllr);
    moc = await makeTokenAddress(SupportedTokens.moc);
    // mocIntegration = (await getProtocolContract('mocIntegrationProxy')).address;
    masset = (await getProtocolContract('massetManager')).address;
    const { address, abi } = await getTokenContract(SupportedTokens.doc);
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
    // @see https://sovryn.atlassian.net/browse/SOV-3560
    // it('returns undefined for approval tx request', async () => {
    //   await expect(
    //     route.approve(dllr, rbtc, constants.WeiPerEther, constants.AddressZero),
    //   ).resolves.toBe(undefined);
    // });
    it('returns transaction request data for approval for ERC-20 tokens', async () => {
      await expect(
        route.approve(dllr, rbtc, constants.MaxInt256, constants.AddressZero),
      ).resolves.toMatchObject({
        to: expect.any(String),
        data: expect.any(String),
      });
    });
  });

  describe('permit', () => {
    // @see https://sovryn.atlassian.net/browse/SOV-3560
    // it('returns valid permit request for DLLR to RBTC swap', async () => {
    //   await expect(
    //     route.permit(dllr, rbtc, constants.WeiPerEther, constants.AddressZero),
    //   ).resolves.toMatchObject({
    //     token: dllr,
    //     spender: mocIntegration,
    //     owner: constants.AddressZero,
    //     value: constants.WeiPerEther,
    //   });
    // });
    it('returns undefined for permit function', async () => {
      await expect(
        route.permit(dllr, rbtc, constants.MaxInt256, constants.AddressZero),
      ).resolves.toBe(undefined);
    });

    it('returns undefined for permit function for non-valid pair', async () => {
      await expect(
        route.permit(moc, rbtc, constants.WeiPerEther, constants.AddressZero),
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

    it('fails build swap tx data if permit is not provided', async () => {
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
