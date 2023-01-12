import { useEffect, useState } from 'react';

import { Contract } from 'ethers/lib/ethers';
import { Subscription } from 'zen-observable-ts';

import { getTokenDetails, getTokenContract } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';

import {
  idHash,
  CacheCallResponse,
  observeCall,
  startCall,
} from '../../../../store/rxjs/provider-cache';
import { getRskChainId } from '../../../../utils/chain';
import { EcosystemDataType } from '../types';

export const useGetAssetBalance = (
  asset: SupportedTokens,
  contractToken: string,
  chainId = getRskChainId(),
): CacheCallResponse<string> => {
  const [state, setState] = useState<CacheCallResponse<string>>({
    value: '0',
    loading: false,
    error: null,
  });

  useEffect(() => {
    let sub: Subscription;
    const getBalance = async () => {
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

      sub = observeCall(hashedArgs).subscribe(e => setState(e.result));

      const callback = () => {
        return new Contract(
          tokenDetails.address,
          tokenDetails.abi,
          getProvider(chainId),
        ).balanceOf(tokenAddress);
      };
      startCall(hashedArgs, callback, {
        ttl: 1000 * 30,
        fallbackToPreviousResult: true,
      });
    };
    getBalance().catch(e => setState({ value: '0', loading: false, error: e }));

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [asset, chainId, contractToken]);

  return { ...state, value: state.value === null ? '0' : state.value };
};
