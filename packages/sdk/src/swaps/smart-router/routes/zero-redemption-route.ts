import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getTokenContract,
  getZeroContract,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  areAddressesEqual,
  canSwapPair,
  makeApproveRequest,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

// Supports converting ZUSD to RBTC via Zero redemption function, and DLLR to RBTC via redeemCollateralViaDllr function on the TroveManager contract.
export const zeroRedemptionSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let contract: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getTroveManagerContract = async () => {
    if (!contract) {
      const { address, abi } = await getZeroContract(
        'troveManager',
        await getChainId(),
      );
      contract = new Contract(address, abi, provider);
      return contract;
    }
    return contract;
  };

  return {
    name: 'ZeroRedemption',
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();

      const ddlr = (
        await getTokenContract(SupportedTokens.dllr, chainId)
      ).address.toLowerCase();
      const zusd = (
        await getTokenContract(SupportedTokens.zusd, chainId)
      ).address.toLowerCase();
      const rbtc = constants.AddressZero;

      pairCache = new Map<string, string[]>([
        [ddlr, [rbtc]],
        [zusd, [rbtc]],
      ]);

      return pairCache;
    },
    async quote(entry, destination, amount, options?, overrides?) {
      const pairs = await this.pairs();
      if (!canSwapPair(entry, destination, pairs)) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      // todo: figure out where to get the price from
      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    async swap(entry, destination, amount, from, options, overrides) {
      const pairs = await this.pairs();
      if (!canSwapPair(entry, destination, pairs)) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      if (
        areAddressesEqual(
          entry,
          (await getTokenContract(SupportedTokens.dllr, chainId)).address,
        )
      ) {
        // todo: https://github.com/DistributedCollective/zero/blob/main/packages/contracts/contracts/TroveManager.sol#L1175
      }

      if (
        areAddressesEqual(
          entry,
          (await getTokenContract(SupportedTokens.zusd, chainId)).address,
        )
      ) {
        // todo: https://github.com/DistributedCollective/zero/blob/main/packages/contracts/contracts/TroveManager.sol#L1159
      }

      throw makeError('Not implemented', SovrynErrorCode.NOT_IMPLEMENTED);
    },
    async approve(entry, destination, amount, from, overrides) {
      // ZUSD needs to be approved for the Zero contract
      if (
        areAddressesEqual(
          entry,
          (await getTokenContract(SupportedTokens.zusd, chainId)).address,
        ) &&
        areAddressesEqual(destination, constants.AddressZero)
      ) {
        return {
          ...makeApproveRequest(
            entry,
            (await getTroveManagerContract()).address,
            amount,
          ),
          ...overrides,
        };
      }

      return undefined;
    },
    async permit(entry, destination, amount, from, overrides) {
      // DLLR needs to be permitted for the zusd contract
      if (
        areAddressesEqual(
          entry,
          (await getTokenContract(SupportedTokens.dllr, chainId)).address,
        ) &&
        areAddressesEqual(destination, constants.AddressZero)
      ) {
        return {
          token: entry,
          spender: (await getTroveManagerContract()).address,
          owner: from,
          value: amount,
          ...overrides,
        };
      }
      return undefined;
    },
  };
};
