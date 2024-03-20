import { BigNumber, utils, providers, constants } from 'ethers';

import { CrocEnv } from '@sovryn/ambient-sdk';
import { getAssetContract } from '@sovryn/contracts';
import { ChainIds } from '@sovryn/ethers-provider';
import { numberToChainId } from '@sovryn/ethers-provider';

import {
  hasEnoughAllowance,
  makeApproveRequest,
} from '../../../internal/utils';
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
      const btc = await getAssetContract('ETH', chainId);
      const sov = await getAssetContract('SOV', chainId);
      const usdc = await getAssetContract('USDC', chainId);
      const usdt = await getAssetContract('USDT', chainId);

      return new Map<string, string[]>([
        [btc.address, [sov.address, usdc.address, usdt.address]],
        [sov.address, [btc.address, usdc.address, usdt.address]],
        [usdc.address, [btc.address, sov.address, usdt.address]],
        [usdt.address, [btc.address, sov.address, usdc.address]],
      ]);
    },
    quote: async (entry, destination, amount) => {
      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      console.log('plan', plan);
      const impact = await plan.impact;

      console.log('impact', impact);

      return utils.parseEther(impact.buyQty);
    },
    approve: async (entry, destination, amount, from, overrides) => {
      if (entry === constants.AddressZero) {
        return undefined;
      }

      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      const contract = await plan.txBase();

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          from,
          contract.address, // Use the contract address directly
          amount ?? constants.MaxUint256,
        )
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(
          entry,
          contract.address, // Use the contract address directly
          amount ?? constants.MaxUint256,
        ),
        ...overrides,
      };
    },
    permit: async () => Promise.resolve(undefined),
    swap: async (entry, destination, amount, from, options, overrides) => {
      const plan = await makePlan(entry, destination, BigNumber.from(amount));
      const txData = await plan.generateSwapData({ from: from });

      return {
        to: txData.to,
        data: txData.data,
        value: txData.value,
        ...overrides,
      };
    },
  };
};
