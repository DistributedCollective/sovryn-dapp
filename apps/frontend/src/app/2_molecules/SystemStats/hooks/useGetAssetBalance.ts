import { useEffect, useState } from 'react';

import { Contract } from 'ethers/lib/ethers';

import { getTokenDetails, getTokenContract } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import {
  idHash,
  asyncCall,
  CacheCallResponse,
} from '../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../utils/chain';
import { EcosystemDataType } from '../types';

export const useGetAssetBalance = (
  asset: SupportedTokens,
  contractToken: string,
  chainId = getRskChainId(),
): CacheCallResponse<string> => {
  const [state, setState] = useState({
    value: '0',
    loading: false,
    error: null,
  });

  useEffect(() => {
    const getBalance = async () => {
      try {
        const { address: tokenAddress } = await getTokenContract(
          contractToken,
          chainId,
        );
        const tokenDetails = await getTokenDetails(asset, chainId);

        const hashedArgs = idHash([
          tokenDetails.address,
          EcosystemDataType.balanceOf,
          tokenAddress,
        ]);
        const callback = async () => {
          const contract = new Contract(
            tokenDetails.address,
            tokenDetails.abi,
            getProvider(chainId),
          );
          const balance = await contract.balanceOf(tokenAddress);
          setState({ value: balance, loading: false, error: null });
        };
        await asyncCall(hashedArgs, callback, {
          ttl: 1000 * 30,
          fallbackToPreviousResult: true,
        });
      } catch (e) {
        setState({ value: '0', loading: false, error: e });
      }
    };
    getBalance();
  }, [asset, chainId, contractToken]);

  return { ...state, value: state.value === null ? '0' : state.value };
};
