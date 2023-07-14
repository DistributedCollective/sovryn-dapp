import { Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { ChainId, ChainIds, numberToChainId } from '@sovryn/ethers-provider';

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
  let mocExchangeContract: Contract;
  let docBagAddress: string;
  let mocAddress: string;

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

  const getMocExchangeContract = async () => {
    if (!mocIntegrationContract) {
      const { address, abi } = await getProtocolContract(
        'mocExchangeProxy',
        await getChainId(),
      );
      mocExchangeContract = new Contract(address, abi, provider);
    }
    return mocExchangeContract;
  };

  const getDocBagAddress = async () => {
    if (!docBagAddress) {
      const chainId = await getChainId();
      if (chainId === ChainIds.RSK_MAINNET) {
        docBagAddress = '0xd715192612F03D20BaE53a5054aF530C9Bb0fA3f';
      }

      if (chainId === ChainIds.RSK_TESTNET) {
        docBagAddress = '0x497b0517dd24f66c456e93bc0adbb2a2bf159ec4';
      }
    }

    return docBagAddress;
  };

  const getMocAddress = async () => {
    if (!mocAddress) {
      const chainId = await getChainId();
      if (chainId === ChainIds.RSK_MAINNET) {
        mocAddress = '0xf773b590af754d597770937fa8ea7abdf2668370';
      }

      if (chainId === ChainIds.RSK_TESTNET) {
        mocAddress = '0x2820f6d4D199B8D8838A4B26F9917754B86a0c1F';
      }
    }

    return mocAddress;
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
        const bag = await getDocBagAddress();
        const exchange = await getMocExchangeContract();
        const moc = await getMocAddress();

        // @see https://github.com/money-on-chain/main-RBTC-contract/blob/c6410b867de8e5de5df763bf8416a10ab8ae3d36/contracts/MoCExchange.sol#L371
        // result[0] is the amount of RBTC
        // result[1] - result[4] commision spent
        const result = await exchange.callStatic.redeemFreeDoc(
          bag,
          amount,
          constants.AddressZero,
          {
            from: moc,
          },
        );

        return result[0];
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
          gasLimit: 800_000,
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
        const spender = await getMocIntegrationContract();
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
