import { useEffect, useState } from 'react';

import { Contract } from 'ethers/lib/ethers';

import { getTokenDetails } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import {
  idHash,
  asyncCall,
  CacheCallResponse,
} from '../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../utils/chain';
import { EcosystemDataType } from '../types';

export const useGetTotalSupply = (
  asset: SupportedTokens,
  chainId = getRskChainId(),
): CacheCallResponse<string> => {
  const [state, setState] = useState({
    value: '0',
    loading: false,
    error: null,
  });

  useEffect(() => {
    const getTotalSupply = async () => {
      try {
        const tokenDetails = await getTokenDetails(asset, chainId);
        const hashedArgs = idHash([
          tokenDetails.address,
          EcosystemDataType.totalSupply,
        ]);
        const callback = async () => {
          const contract = new Contract(
            tokenDetails.address,
            tokenDetails.abi,
            getProvider(chainId),
          );
          const totalSupply = await contract.totalSupply();
          setState({ value: totalSupply, loading: false, error: null });
        };
        await asyncCall(hashedArgs, callback, {
          ttl: 1000 * 30,
          fallbackToPreviousResult: true,
        });
      } catch (e) {
        setState({ value: '0', loading: false, error: e });
      }
    };
    getTotalSupply();
  }, [asset, chainId]);

  return { ...state, value: state.value === null ? '0' : state.value };
};
