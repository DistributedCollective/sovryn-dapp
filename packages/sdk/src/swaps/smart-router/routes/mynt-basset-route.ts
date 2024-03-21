import { BigNumber, Contract, constants, providers } from 'ethers';

import { getAssetContract, getProtocolContract } from '@sovryn/contracts';
import { ChainId, ChainIds, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  areAddressesEqual,
  canSwapPair,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

export const myntBassetRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let dllr: string;
  let chainId: ChainId;

  let massetManager: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getDllrToken = async () => {
    if (!dllr) {
      const chainId = await getChainId();
      dllr = (await getAssetContract('DLLR', chainId)).address.toLowerCase();
    }
    return dllr;
  };

  const getMassetManagerContract = async () => {
    if (!massetManager) {
      const chainId = await getChainId();
      const { address, abi } = await getProtocolContract(
        'massetManager',
        chainId,
      );
      massetManager = new Contract(address, abi, provider);
    }
    return massetManager;
  };

  return {
    name: 'MyntBasset',
    chains: [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET],
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();
      const dllr = await getDllrToken();
      const zusd = (
        await getAssetContract('ZUSD', chainId)
      ).address.toLowerCase();
      const doc = (
        await getAssetContract('DOC', chainId)
      ).address.toLowerCase();

      pairCache = new Map<string, string[]>([
        [dllr, [zusd, doc]],
        [zusd, [dllr]],
        [doc, [dllr]],
      ]);

      return pairCache;
    },
    async quote(entry, destination, amount) {
      // Mynt bAsset only converts stablecoins 1:1, so we can just return the amount if pairs are supported.
      const pairs = await this.pairs();
      if (canSwapPair(entry, destination, pairs)) {
        return BigNumber.from(amount);
      }
      throw makeError(
        `Cannot swap ${entry} to ${destination}`,
        SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
      );
    },
    async swap(entry, destination, amount, from, options, overrides) {
      const pairs = await this.pairs();
      if (!canSwapPair(entry, destination, pairs)) {
        throw makeError(
          `Cannot swap ${entry} to ${destination}`,
          SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
        );
      }

      const dllr = await getDllrToken();
      const { address, interface: iface } = await getMassetManagerContract();

      return {
        to: address,
        data: iface.encodeFunctionData(
          areAddressesEqual(entry, dllr) ? 'redeemTo' : 'mintTo',
          [areAddressesEqual(entry, dllr) ? destination : entry, amount, from],
        ),
        value: '0',
        ...overrides,
      };
    },
    async approve(entry, destination, amount, from, overrides) {
      const dllr = await getDllrToken();
      if (entry === dllr) {
        return undefined;
      }

      const spender = (await getMassetManagerContract()).address;

      if (
        await hasEnoughAllowance(
          provider,
          entry,
          from,
          spender,
          amount ?? constants.MaxUint256,
        )
      ) {
        return undefined;
      }

      return {
        ...makeApproveRequest(entry, spender, amount ?? constants.MaxUint256),
        ...overrides,
      };
    },
    async permit() {
      return undefined;
    },
  };
};
