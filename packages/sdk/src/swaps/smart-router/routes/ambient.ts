import { BigNumber, utils, providers } from 'ethers';

import { ChainIds } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapRouteFunction } from '../types';
import { getTokenContract } from '@sovryn/contracts';
import { CrocEnv } from '@sovryn/ambient-sdk';

export const ambientRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
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
    chains: [ChainIds.MAINNET],
    pairs: async () => {
      const rbtc = await getTokenContract('rbtc', ChainIds.MAINNET);
      const dllr = await getTokenContract('dllr', ChainIds.MAINNET);

      return new Map<string, string[]>([
        [rbtc.address, [dllr.address]],
        [dllr.address, [rbtc.address]],
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
