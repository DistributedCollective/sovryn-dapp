import { useMemo } from 'react';

import { BigNumber, BigNumberish, constants } from 'ethers';

import { getTokenContract, SupportedTokens } from '@sovryn/contracts';
import { ChainId } from '@sovryn/ethers-provider';

import {
  CacheCallOptions,
  CacheCallResponse,
} from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { composeGas } from '../utils/helpers';
import { useAssetBalance } from './useAssetBalance';
import { useAsync } from './useAsync';
import { useGasPrice } from './useGasPrice';

const MAX_GAS_LIMIT = 68000000; // 6.8M (rsk block gas limit)

export const useMaxAssetBalance = (
  asset: SupportedTokens,
  chainId: ChainId = getRskChainId(),
  gasLimit: BigNumberish = MAX_GAS_LIMIT,
  options?: Partial<CacheCallOptions>,
): CacheCallResponse<string> => {
  const gasPrice = useGasPrice(chainId);
  const balance = useAssetBalance(asset, chainId, null, 0, options);

  const contract = useAsync(() => getTokenContract(asset, chainId));

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
