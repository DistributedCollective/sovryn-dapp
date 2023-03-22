import { useEffect, useState } from 'react';

import { Contract } from 'ethers/lib/ethers';
import { Subscription } from 'zen-observable-ts';

import { getTokenDetails } from '@sovryn/contracts';
import { SupportedTokens } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

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
): CacheCallResponse<Decimal> => {
  const [state, setState] = useState<CacheCallResponse<Decimal>>({
    value: Decimal.ZERO,
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
        )
          .totalSupply()
          .then(Decimal.fromBigNumberString);
      };
      startCall(hashedArgs, callback, {
        ttl: 1000 * 30,
        fallbackToPreviousResult: true,
      });
    };
    getTotalSupply().catch(e =>
      setState({ value: Decimal.ZERO, loading: false, error: e }),
    );

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [asset, chainId]);

  return { ...state, value: state.value === null ? Decimal.ZERO : state.value };
};
