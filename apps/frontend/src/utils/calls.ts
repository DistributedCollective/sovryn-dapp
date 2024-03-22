import { Contract } from 'ethers';

import { getProtocolContract } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../config/chains';

import { asyncCall } from '../store/rxjs/provider-cache';
import { findAsset } from './asset';

export const queryReturn = async (
  sourceToken: string,
  destToken: string,
  sourceAmount: Decimal,
): Promise<Decimal> =>
  asyncCall<Decimal>(
    `priceFeed/return/${sourceToken}-${destToken}/${sourceAmount.toHexString()}`,
    async () => {
      const { address: sourceTokenAddress } = findAsset(
        sourceToken,
        RSK_CHAIN_ID,
      );
      const { address: destTokenAddress } = findAsset(destToken, RSK_CHAIN_ID);
      const { address, abi } = await getProtocolContract(
        'priceFeed',
        RSK_CHAIN_ID,
      );
      const contract = new Contract(address, abi, getProvider(RSK_CHAIN_ID));
      const rate = await contract.queryReturn(
        sourceTokenAddress,
        destTokenAddress,
        sourceAmount.toHexString(),
      );

      return Decimal.fromBigNumberString(rate);
    },
  );

export const queryRate = async (
  sourceToken: string,
  destToken: string,
): Promise<{ rate: Decimal; precision: Decimal }> =>
  asyncCall<{ rate: Decimal; precision: Decimal }>(
    `priceFeed/rate/${sourceToken}-${destToken}`,
    async () => {
      const { address: sourceTokenAddress } = findAsset(
        sourceToken,
        RSK_CHAIN_ID,
      );
      const { address: destTokenAddress } = findAsset(destToken, RSK_CHAIN_ID);
      const { address, abi } = await getProtocolContract(
        'priceFeed',
        RSK_CHAIN_ID,
      );
      const contract = new Contract(address, abi, getProvider(RSK_CHAIN_ID));
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
