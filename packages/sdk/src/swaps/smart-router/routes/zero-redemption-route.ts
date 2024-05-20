import { BigNumber, Contract, constants, providers } from 'ethers';

import { Decimal } from '@sovryn-zero/lib-base';
import {
  ReadableEthersLiquity,
  EthersLiquity,
  PopulatableEthersLiquity,
} from '@sovryn-zero/lib-ethers';
import {
  getAssetContract,
  getProtocolContract,
  getZeroContract,
} from '@sovryn/contracts';
import { ChainId, ChainIds, numberToChainId } from '@sovryn/ethers-provider';

import { SovrynErrorCode, makeError } from '../../../errors/errors';
import {
  areAddressesEqual,
  canSwapPair,
  makeApproveRequest,
  hasEnoughAllowance,
} from '../../../internal/utils';
import { SwapPairs, SwapRouteFunction } from '../types';
import { prepareERC2612Permit, preparePermitResponse } from '../utils/permit';

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
    chains: [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET],
    async pairs() {
      if (pairCache) {
        return pairCache;
      }

      const chainId = await getChainId();

      const dllr = (
        await getAssetContract('DLLR', chainId)
      ).address.toLowerCase();
      const zusd = (
        await getAssetContract('ZUSD', chainId)
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

      const readable = await ReadableEthersLiquity.connect(provider, {
        useStore: 'blockPolled',
      });
      const ethers = new EthersLiquity(readable);

      const [fees, total, feed, wrbtc, rusdt] = await Promise.all([
        ethers.getFees(),
        ethers.getTotal(),
        getPriceFeedContract(),
        getAssetContract('WBTC', chainId),
        getAssetContract('RUSDT', chainId),
      ]);

      const maxRedemptionRate = fees
        .redemptionRate(
          Decimal.fromBigNumberString(amount.toString()).div(total.debt),
        )
        .add(Decimal.from(0.001));

      const price = await feed.queryRate(
        wrbtc.address,
        // price feed uses old rUSDT address for testnet
        chainId === ChainIds.RSK_TESTNET
          ? '0x4D5a316D23eBE168d8f887b4447bf8DbFA4901CC'.toLowerCase()
          : rusdt.address,
      );

      const btcUsd = BigNumber.from(amount)
        .mul(price.precision)
        .div(price.rate);

      const fee = Decimal.from(1).sub(maxRedemptionRate);
      const quote = btcUsd.mul(fee.bigNumber).div(constants.WeiPerEther);

      return quote;
    },
    async swap(entry, destination, amount, from, options, overrides) {
      const readable = await ReadableEthersLiquity.connect(provider, {
        useStore: 'blockPolled',
      });
      const populatable = new PopulatableEthersLiquity(readable);

      if (
        areAddressesEqual(
          entry,
          (await getAssetContract('DLLR', chainId)).address,
        )
      ) {
        if (!options?.typedDataValue || !options?.typedDataSignature) {
          throw makeError(
            `Permit is required for swap.`,
            SovrynErrorCode.UNKNOWN_ERROR,
          );
        }

        const permit = preparePermitResponse(
          options.typedDataValue,
          options.typedDataSignature,
        );

        const { rawPopulatedTransaction } =
          await populatable.redeemCollateralViaDLLR(
            Decimal.fromBigNumberString(amount.toString()),
            permit,
          );

        const gasLimit = rawPopulatedTransaction.gasLimit?.lt(1_500_000)
          ? 1_500_000
          : rawPopulatedTransaction.gasLimit;

        return {
          to: rawPopulatedTransaction.to,
          data: rawPopulatedTransaction.data,
          value: '0',
          gasLimit,
          ...overrides,
        };
      }

      if (
        areAddressesEqual(
          entry,
          (await getAssetContract('ZUSD', chainId)).address,
        )
      ) {
        const { rawPopulatedTransaction } = await populatable.redeemZUSD(
          Decimal.fromBigNumberString(amount.toString()),
        );

        const gasLimit = rawPopulatedTransaction.gasLimit?.lt(800_000)
          ? 800_000
          : rawPopulatedTransaction.gasLimit;

        return {
          to: rawPopulatedTransaction.to,
          data: rawPopulatedTransaction.data,
          value: '0',
          gasLimit,
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
          (await getAssetContract('ZUSD', chainId)).address,
        ) &&
        areAddressesEqual(destination, constants.AddressZero)
      ) {
        const spender = (await getTroveManagerContract()).address;

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
          (await getAssetContract('DLLR', chainId)).address,
        ) &&
        areAddressesEqual(destination, constants.AddressZero)
      ) {
        return {
          approvalRequired: false,
          typedData: await prepareERC2612Permit(
            provider,
            entry,
            from,
            (
              await getTroveManagerContract()
            ).address,
            amount.toString(),
          ),
        };
      }
      return undefined;
    },
  };
};
