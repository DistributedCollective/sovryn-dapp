import { useMemo } from 'react';

import { constants } from 'ethers';

import {
  ContractConfigData,
  getTokenContract,
  SupportedTokens,
} from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';
import { Decimalish, Decimal } from '@sovryn/utils';

import { GAS_LIMIT } from '../constants/gasLimits';
import { CacheCallOptions } from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { composeGas } from '../utils/helpers';
import { AssetBalanceResponse, useAssetBalance } from './useAssetBalance';
import { useAsync } from './useAsync';
import { useGasPrice } from './useGasPrice';

export const useMaxAssetBalance = (
  asset: SupportedTokens,
  chainId: ChainId = getRskChainId(),
  gasLimit: Decimalish = GAS_LIMIT.MAX,
  options?: Partial<CacheCallOptions>,
): AssetBalanceResponse => {
  const gasPrice = useGasPrice(chainId);
  const result = useAssetBalance(asset, chainId, null, 0, options);

  const contract = useAsync<ContractConfigData>(() =>
    getTokenContract(asset, chainId),
  );

  return useMemo(() => {
    const value = Decimal.max(
      result.balance.sub(
        contract?.address === constants.AddressZero
          ? composeGas(gasPrice || '0', gasLimit)
          : 0,
      ),
      0,
    );

    return {
      weiBalance: value.toBigNumber().toString(),
      balance: value,
      bigNumberBalance: value.toBigNumber(),
      decimalPrecision: result.decimalPrecision,
      loading: gasPrice.eq(0),
      error: null,
      hasProvidedDefaultValues: false,
    };
  }, [
    result.balance,
    result.decimalPrecision,
    contract?.address,
    gasPrice,
    gasLimit,
  ]);
};
