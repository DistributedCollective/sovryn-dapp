import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { areAddressesEqual } from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

// Supports converting DLLR to RBTC via getDocFromDllrAndRedeemRBTC function on the MoCIntegration contract.
export const mocIntegrationSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let mocIntegrationContract: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const isValidPair = async (entry: string, destination: string) => {
    if (
      areAddressesEqual(
        entry,
        (await getTokenContract(SupportedTokens.dllr, chainId)).address,
      ) &&
      areAddressesEqual(destination, constants.AddressZero)
    ) {
      return true;
    }
    return false;
  };

  const getMocIntegrationContract = async () => {
    if (!mocIntegrationContract) {
      const { address, abi } = await getProtocolContract(
        'mocIntegrationProxy',
        await getChainId(),
      );
      mocIntegrationContract = new Contract(address, abi, provider);
    }
    return mocIntegrationContract;
  };

  return {
    name: 'MocIntegration',
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();

      const dllr = (
        await getTokenContract(SupportedTokens.dllr, chainId)
      ).address.toLowerCase();
      const rbtc = constants.AddressZero;

      pairCache = new Map<string, string[]>([[dllr, [rbtc]]]);

      return pairCache;
    },
    async quote(entry, destination, amount, options?, overrides?) {
      if (await isValidPair(entry, destination)) {
        // todo: figure out where to get the price from
        throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
      }

      throw makeError(
        `Cannot swap ${entry} to ${destination}`,
        SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
      );
    },
    async swap(entry, destination, amount, from, options, overrides) {
      if (await isValidPair(entry, destination)) {
        if (!options?.permit) {
          throw makeError(
            `Permit is required for swap.`,
            SovrynErrorCode.UNKNOWN_ERROR,
          );
        }

        const mocIntegration = await getMocIntegrationContract();
        return {
          to: mocIntegration.address,
          data: mocIntegration.interface.encodeFunctionData(
            'getDocFromDllrAndRedeemRBTC',
            [amount, options?.permit],
          ),
          value: '0',
          ...overrides,
        };
      }

      throw makeError(
        `Cannot swap ${entry} to ${destination}`,
        SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
      );
    },
    async approve() {
      return undefined;
    },
    async permit(entry, destination, amount, from, overrides) {
      // DLLR needs to be permitted for the moc contract
      if (await isValidPair(entry, destination)) {
        const spender = await getTokenContract(
          SupportedTokens.moc,
          await getChainId(),
        );
        return {
          token: entry,
          spender: spender.address,
          owner: from,
          value: amount,
          ...overrides,
        };
      }
      return undefined;
    },
  };
};
