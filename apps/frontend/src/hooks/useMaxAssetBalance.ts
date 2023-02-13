import { useMemo } from 'react';

import { BigNumber, BigNumberish, constants } from 'ethers';

import {
  ContractConfigData,
  getTokenContract,
  SupportedTokens,
} from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import {
  CacheCallOptions,
  CacheCallResponse,
} from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { MAX_GAS_LIMIT } from '../utils/constants';
import { composeGas } from '../utils/helpers';
import { useAssetBalance } from './useAssetBalance';
import { useAsync } from './useAsync';
import { useGasPrice } from './useGasPrice';

export const useMaxAssetBalance = (
  asset: SupportedTokens,
  chainId: ChainId = getRskChainId(),
  gasLimit: BigNumberish = MAX_GAS_LIMIT,
  options?: Partial<CacheCallOptions>,
): CacheCallResponse<string> => {
  const gasPrice = useGasPrice(chainId);
  const balance = useAssetBalance(asset, chainId, null, 0, options);

  const contract = useAsync<ContractConfigData>(() =>
    getTokenContract(asset, chainId),
  );

  return useMemo(() => {
    const value = BigNumber.from(balance.value).sub(
      contract?.address === constants.AddressZero
        ? composeGas(gasPrice || '0', gasLimit)
        : 0,
    );
    return {
      value: value.gt(0) ? value.toString() : '0',
      loading: false,
      error: null,
    };
  }, [balance.value, contract?.address, gasPrice, gasLimit]);
};
