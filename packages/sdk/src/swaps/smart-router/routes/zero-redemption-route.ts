import { BigNumber, Contract, constants, providers } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
  getZeroContract,
} from '@sovryn/contracts';
import { ChainId, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  areAddressesEqual,
  canSwapPair,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';

export const zeroRedemptionSwapRoute: SwapRouteFunction = (
  provider: providers.Provider,
) => {
  let pairCache: SwapPairs;
  let chainId: ChainId;
  let contract: Contract;
  let priceFeedContract: Contract;

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

  const getPriceFeedContract = async () => {
    if (!priceFeedContract) {
      const { address, abi } = await getProtocolContract(
        'priceFeed',
        await getChainId(),
      );
      priceFeedContract = new Contract(address, abi, provider);
    }
    return priceFeedContract;
  };

  return {
    name: 'ZeroRedemption',
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();

      const dllr = (
        await getTokenContract(SupportedTokens.dllr, chainId)
      ).address.toLowerCase();
      const zusd = (
        await getTokenContract(SupportedTokens.zusd, chainId)
      ).address.toLowerCase();
      const rbtc = constants.AddressZero;

      pairCache = new Map<string, string[]>([
        [dllr, [rbtc]],
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

      const { Decimal } = await import('@sovryn-zero/lib-base');
      const { ReadableEthersLiquity, EthersLiquity } = await import(
        '@sovryn-zero/lib-ethers'
      );

      const readable = await ReadableEthersLiquity.connect(provider, {
        useStore: 'blockPolled',
      });
      const ethers = new EthersLiquity(readable);

      const [fees, total, feed, wrbtc, rusdt] = await Promise.all([
        ethers.getFees(),
        ethers.getTotal(),
        getPriceFeedContract(),
        getTokenContract(SupportedTokens.wrbtc, chainId),
        getTokenContract(SupportedTokens.rusdt, chainId),
      ]);

      const maxRedemptionRate = fees
        .redemptionRate(
          Decimal.fromBigNumberString(amount.toString()).div(total.debt),
        )
        .add(Decimal.from(0.001));

      const price = await feed.queryRate(wrbtc.address, rusdt.address);

      const btcUsd = BigNumber.from(amount)
        .mul(price.precision)
        .div(price.rate);

      const fee = Decimal.from(1).sub(maxRedemptionRate);
      const quote = btcUsd.mul(fee.bigNumber).div(constants.WeiPerEther);

      return quote;
    },
    async swap(entry, destination, amount, from, options, overrides) {
      const { Decimal } = await import('@sovryn-zero/lib-base');
      const { ReadableEthersLiquity, PopulatableEthersLiquity } = await import(
        '@sovryn-zero/lib-ethers'
      );

      const readable = await ReadableEthersLiquity.connect(provider, {
        useStore: 'blockPolled',
      });
      const populatable = new PopulatableEthersLiquity(readable);

      if (
        areAddressesEqual(
          entry,
          (await getTokenContract(SupportedTokens.dllr, chainId)).address,
        )
      ) {
        if (!options?.permit) {
          throw makeError(
            `Permit is required for swap.`,
            SovrynErrorCode.UNKNOWN_ERROR,
          );
        }

        const { rawPopulatedTransaction } =
          await populatable.redeemCollateralViaDLLR(
            Decimal.fromBigNumberString(amount.toString()),
            options.permit,
          );

        return {
          to: rawPopulatedTransaction.to,
          data: rawPopulatedTransaction.data,
          value: '0',
          gasLimit: rawPopulatedTransaction.gasLimit,
          ...overrides,
        };
      }

      if (
        areAddressesEqual(
          entry,
          (await getTokenContract(SupportedTokens.zusd, chainId)).address,
        )
      ) {
        const { rawPopulatedTransaction } = await populatable.redeemZUSD(
          Decimal.fromBigNumberString(amount.toString()),
        );

        return {
          to: rawPopulatedTransaction.to,
          data: rawPopulatedTransaction.data,
          value: '0',
          gasLimit: rawPopulatedTransaction.gasLimit,
          ...overrides,
        };
      }

      throw makeError(
        `Cannot swap ${entry} to ${destination}`,
        SovrynErrorCode.SWAP_PAIR_NOT_AVAILABLE,
      );
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
        const spender = (await getTroveManagerContract()).address;

        if (
          await hasEnoughAllowance(
            provider,
            entry,
            spender,
            from,
            amount ?? constants.MaxUint256,
          )
        ) {
          return undefined;
        }

        return {
          ...makeApproveRequest(entry, spender, amount),
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
