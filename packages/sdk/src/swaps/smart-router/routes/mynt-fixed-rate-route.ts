import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  canSwapPair,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

export const myntFixedRateRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let fixedRateMyntContract: Contract;
  let protocolContract: Contract;

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

  const getSwapQuoteContract = async () => {
    if (!protocolContract) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract('protocol', chainId);
      protocolContract = new Contract(address, abi, provider);
    }
    return protocolContract;
  };

  return {
    name: 'MyntFixedRate',
    pairs: async () => {
      if (!pairCache) {
        const chainId = await getChainId();

        const swapTokens = [SupportedTokens.sov, SupportedTokens.mynt];

        const contracts = await Promise.all(
          swapTokens.map(token => getTokenContract(token, chainId)),
        );

        const addresses = contracts.map(contract =>
          contract.address.toLowerCase(),
        );

        const pairs = new Map<string, string[]>();

        for (const address of addresses) {
          const pair = addresses.filter(a => a !== address);
          pairs.set(address, pair);
        }

        pairCache = pairs;
      }

      return pairCache;
    },
    quote: async (entry, destination, amount) => {
      return (await getSwapQuoteContract())
        .getSwapExpectedReturn(
          entry.toLowerCase(),
          destination.toLowerCase(),
          amount,
        )
        .catch(e => {
          throw makeError(e.message, SovrynErrorCode.ETHERS_CALL_EXCEPTION);
        });
    },
    approve: async (entry, destination, amount, from, overrides) => {
      const converter = await getConverterContract();

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          converter.address,
          from,
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
