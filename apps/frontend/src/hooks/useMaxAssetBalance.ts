import { useMemo } from 'react';

import { BigNumber, BigNumberish, constants } from 'ethers';

import {
  ContractConfigData,
  getTokenContract,
  SupportedTokens,
} from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import { CacheCallOptions } from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { MAX_GAS_LIMIT } from '../utils/constants';
import { composeGas } from '../utils/helpers';
import { fromWei, ZERO } from '../utils/math';
import { AssetBalanceResponse, useAssetBalance } from './useAssetBalance';
import { useAsync } from './useAsync';
import { useGasPrice } from './useGasPrice';

export const useMaxAssetBalance = (
  asset: SupportedTokens,
  chainId: ChainId = getRskChainId(),
  gasLimit: BigNumberish = MAX_GAS_LIMIT,
  options?: Partial<CacheCallOptions>,
): AssetBalanceResponse => {
  const gasPrice = useGasPrice(chainId);
  const result = useAssetBalance(asset, chainId, null, 0, options);

  const contract = useAsync<ContractConfigData>(() =>
    getTokenContract(asset, chainId),
  );

  return useMemo(() => {
    const value = BigNumber.from(result.weiBalance).sub(
      contract?.address === constants.AddressZero
        ? composeGas(gasPrice || '0', gasLimit)
        : 0,
    );
    return {
      weiBalance: value.gt(0) ? value.toString() : '0',
      balance: fromWei(
        value.gt(0) ? value.toString() : '0',
        result.decimalPrecision,
      ),
      bigNumberBalance: value.gt(0) ? value : ZERO,
      decimalPrecision: result.decimalPrecision,
      loading: false,
      error: null,
    };
  }, [
    result.weiBalance,
    result.decimalPrecision,
    contract?.address,
    gasPrice,
    gasLimit,
  ]);
};
