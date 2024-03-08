import { BigNumber, utils, providers } from 'ethers';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getTokenContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { numberToChainId } from '@sovryn/ethers-provider';

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
      console.log('approve', entry, destination, amount, from, overrides);

      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      const contract = await plan.txBase();

      const approveTx = await contract.populateTransaction.approve(
        plan.baseToken.tokenAddr,
        plan.qtyInBase ? await plan.qty : await plan.calcSlipQty(),
        overrides,
      );

      return approveTx;
    },
    permit: async () => Promise.resolve(undefined),
    async swap(entry, destination, amount, from, options, overrides) {
      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      const tx = await plan.generateSwapData({ from: from });
      const contract = await plan.txBase();

      const swapTx = await contract.populateTransaction.swap(
        plan.baseToken.tokenAddr,
        plan.quoteToken.tokenAddr,
        (
          await plan.context
        ).chain.poolIndex,
        plan.sellBase,
        plan.qtyInBase,
        await plan.qty,
        0,
        await plan.calcLimitPrice(),
        await plan.calcSlipQty(),
        plan.maskSurplusArgs(),
        await plan.buildTxArgs(plan.maskSurplusArgs(), tx.value),
        overrides,
      );

      return swapTx;
    },
  };
};
