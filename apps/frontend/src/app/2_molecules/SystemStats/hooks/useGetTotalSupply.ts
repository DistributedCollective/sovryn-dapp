import { useEffect, useState } from 'react';

import { Contract } from 'ethers/lib/ethers';
import { Subscription } from 'zen-observable-ts';

import { getTokenDetails } from '@sovryn/contracts';
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

export const useGetTotalSupply = (
  asset: SupportedTokens,
  chainId = getRskChainId(),
): CacheCallResponse<string> => {
  const [state, setState] = useState<CacheCallResponse<string>>({
    value: '0',
    loading: false,
    error: null,
  });

  useEffect(() => {
    let sub: Subscription;
    const getTotalSupply = async () => {
      const tokenDetails = await getTokenDetails(asset, chainId);
      const hashedArgs = idHash([
        tokenDetails.address,
        EcosystemDataType.totalSupply,
      ]);

      sub = observeCall(hashedArgs).subscribe(e => setState(e.result));

      const callback = async () => {
        return new Contract(
          tokenDetails.address,
          tokenDetails.abi,
          getProvider(chainId),
        ).totalSupply();
      };
      startCall(hashedArgs, callback, {
        ttl: 1000 * 30,
        fallbackToPreviousResult: true,
      });
    };
    getTotalSupply().catch(e =>
      setState({ value: '0', loading: false, error: e }),
    );

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [asset, chainId]);

  return { ...state, value: state.value === null ? '0' : state.value };
};
