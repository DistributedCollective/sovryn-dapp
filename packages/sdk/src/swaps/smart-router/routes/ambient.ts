import { BigNumber, utils, providers } from 'ethers';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getTokenContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapRouteFunction } from '../types';

export const ambientRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  const getChainId = async () =>
    numberToChainId((await provider.getNetwork()).chainId);

  const makePlan = async (
    entry: string,
    destination: string,
    _amount: BigNumber,
    slippage?: number,
  ) => {
    const env = new CrocEnv(provider);

    const entryToken = await env.tokens.materialize(entry);
    const entryTokenDecimals = await entryToken.decimals;

    const amount = utils.parseUnits(
      utils.formatEther(_amount),
      entryTokenDecimals,
    );

    return env
      .sell(entry, BigNumber.from(amount))
      .for(destination, { slippage });
  };

  return {
    name: 'Ambient',
    chains: [ChainIds.BOB_MAINNET, ChainIds.BOB_TESTNET],
    pairs: async () => {
      const chainId = await getChainId();
      console.log('chainId', chainId);
      const btc = await getTokenContract('btc', chainId);
      const sov = await getTokenContract('sov', chainId);

      return new Map<string, string[]>([
        [btc.address, [sov.address]],
        [sov.address, [btc.address]],
      ]);
    },
    quote: async (entry, destination, amount) => {
      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      console.log('plan', plan);
      const impact = await plan.impact;
      return utils.parseEther(impact.buyQty);
    },
    approve: async (entry, destination, amount, from, overrides) => {
      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      console.log(plan);
      return Promise.resolve(undefined);
    },
    permit: async () => Promise.resolve(undefined),
    async swap(entry, destination, amount, from, options, overrides) {
      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      console.log('plan::', plan);
      const tx = await plan.swapArgs({ from: from });
      console.log('tx::', tx);

      throw makeError(
        'swap not implemented',
        SovrynErrorCode.ETHERS_CALL_EXCEPTION,
      );
    },
  };
};
