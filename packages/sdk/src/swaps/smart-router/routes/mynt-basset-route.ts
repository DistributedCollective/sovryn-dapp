import { BigNumber, Contract, constants, providers } from 'ethers';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import { SwapPairs, SwapRouteFunction } from '../types';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';
import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import {
  areAddressesEqual,
  canSwapPair,
  makeApproveRequest,
} from '../../../internal/utils';

export const myntBassetRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let ddlr: string;
  let chainId: ChainId;

  let massetManager: Contract;

  const getChainId = async () => {
    if (!chainId) {
      chainId = numberToChainId((await provider.getNetwork()).chainId);
    }
    return chainId;
  };

  const getDllrToken = async () => {
    if (!ddlr) {
      const chainId = await getChainId();
      ddlr = (await getTokenContract(SupportedTokens.dllr, chainId)).address;
    }
    return ddlr;
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
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();
      const dllr = await getDllrToken();
      const zusd = (await getTokenContract(SupportedTokens.zusd, chainId))
        .address;
      const doc = (await getTokenContract(SupportedTokens.doc, chainId))
        .address;

      pairCache = new Map<string, string[]>([
        [dllr, [zusd, doc]],
        [zusd, [dllr]],
        [doc, [dllr]],
      ]);

      return pairCache;
    },
    async quote(entry, destination, amount, options?, overrides?) {
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
      if (canSwapPair(entry, destination, pairs)) {
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
          [destination, amount, from],
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

      return {
        ...makeApproveRequest(
          entry,
          (await getMassetManagerContract()).address,
          amount ?? constants.MaxUint256,
        ),
        ...overrides,
      };
    },
    async permit(entry, destination, amount, from, overrides) {
      return undefined;
    },
  };
};
