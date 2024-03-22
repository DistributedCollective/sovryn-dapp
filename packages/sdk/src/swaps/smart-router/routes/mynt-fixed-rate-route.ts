import { BigNumber, Contract, constants, providers, utils } from 'ethers';

import { getAsset, getProtocolContract } from '@sovryn/contracts';
import { ChainId, ChainIds, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  canSwapPair,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

const FIXED_RATE_AMOUNT = '0.004723550439442834';

export const myntFixedRateRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let fixedRateMyntContract: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getFixedRateMyntContract = async () => {
    const chainId = await getChainId();
    const { address, abi } = await getProtocolContract(
      'fixedRateMynt',
      chainId,
    );
    return new Contract(address, abi, provider);
  };

  const getConverterContract = async () => {
    if (!fixedRateMyntContract) {
      fixedRateMyntContract = await getFixedRateMyntContract();
    }
    return fixedRateMyntContract;
  };

  return {
    name: 'MyntFixedRate',
    chains: [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET],
    pairs: async () => {
      if (!pairCache) {
        const chainId = await getChainId();
        const mynt = (await getAsset('MYNT', chainId)).address.toLowerCase();
        const sov = (await getAsset('SOV', chainId)).address.toLowerCase();
        pairCache = new Map<string, string[]>([[mynt, [sov]]]);
      }
      return pairCache;
    },
    quote: async (entry, destination, amount) => {
      const converter = await getConverterContract();
      const maxAmount = await converter.convertMax();
      const rate = utils.parseEther(FIXED_RATE_AMOUNT);
      if (BigNumber.from(amount).gt(maxAmount)) {
        throw new Error('Amount exceeds the maximum convertible MYNT limit.');
      }
      return BigNumber.from(amount).mul(rate).div(constants.WeiPerEther);
    },
    approve: async (entry, destination, amount, from, overrides) => {
      const converter = await getConverterContract();

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          from,
          converter.address,
          amount ?? constants.MaxUint256,
        )
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(
          entry,
          converter.address,
          amount ?? constants.MaxUint256,
        ),
        ...overrides,
      };
    },
    permit: async () => Promise.resolve(undefined),
    async swap(entry, destination, amount, from, options, overrides) {
      const pairs = await this.pairs();
      if (!canSwapPair(entry, destination, pairs)) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }
      const converter = await getConverterContract();

      return {
        to: converter.address,
        data: converter.interface.encodeFunctionData('convert', [amount]),
        value: '0',
        ...overrides,
      };
    },
  };
};
