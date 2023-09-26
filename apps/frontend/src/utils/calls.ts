import { Contract } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenContract,
} from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../config/chains';

import { asyncCall } from '../store/rxjs/provider-cache';

const normalizeToken = (token: SupportedTokens) =>
  token === SupportedTokens.rbtc ? SupportedTokens.wrbtc : token;

export const queryReturn = async (
  sourceToken: SupportedTokens,
  destToken: SupportedTokens,
  sourceAmount: Decimal,
): Promise<Decimal> =>
  asyncCall<Decimal>(
    `priceFeed/return/${sourceToken}-${destToken}/${sourceAmount.toHexString()}`,
    async () => {
      const { address: sourceTokenAddress } = await getTokenContract(
        normalizeToken(sourceToken),
        defaultChainId,
      );
      const { address: destTokenAddress } = await getTokenContract(
        normalizeToken(destToken),
        defaultChainId,
      );
      const { address, abi } = await getProtocolContract(
        'priceFeed',
        defaultChainId,
      );
      const contract = new Contract(address, abi, getProvider(defaultChainId));
      const rate = await contract.queryReturn(
        sourceTokenAddress,
        destTokenAddress,
        sourceAmount.toHexString(),
      );

      return Decimal.fromBigNumberString(rate);
    },
  );

export const queryRate = async (
  sourceToken: SupportedTokens,
  destToken: SupportedTokens,
): Promise<{ rate: Decimal; precision: Decimal }> =>
  asyncCall<{ rate: Decimal; precision: Decimal }>(
    `priceFeed/rate/${sourceToken}-${destToken}`,
    async () => {
      const { address: sourceTokenAddress } = await getTokenContract(
        normalizeToken(sourceToken),
        defaultChainId,
      );
      const { address: destTokenAddress } = await getTokenContract(
        normalizeToken(destToken),
        defaultChainId,
      );
      const { address, abi } = await getProtocolContract(
        'priceFeed',
        defaultChainId,
      );
      const contract = new Contract(address, abi, getProvider(defaultChainId));
      const rate = await contract.queryRate(
        sourceTokenAddress,
        destTokenAddress,
      );

      return {
        rate: Decimal.fromBigNumberString(rate.rate),
        precision: Decimal.fromBigNumberString(rate.precision),
      };
    },
  );
