import { useEffect, useState } from 'react';

import { Contract } from 'ethers/lib/ethers';
import { Subscription } from 'zen-observable-ts';

import { getAssetData } from '@sovryn/contracts';
import { getProvider } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useBlockNumber } from '../../../../hooks/useBlockNumber';
import {
  idHash,
  CacheCallResponse,
  observeCall,
  startCall,
} from '../../../../store/rxjs/provider-cache';
import { EcosystemDataType } from '../types';

export const useGetTotalSupply = (
  asset: string,
  chainId = RSK_CHAIN_ID,
): CacheCallResponse<Decimal> => {
  const { value: block } = useBlockNumber(chainId);
  const [state, setState] = useState<CacheCallResponse<Decimal>>({
    value: Decimal.ZERO,
    loading: false,
    error: null,
  });

  useEffect(() => {
    let sub: Subscription;
    const getTotalSupply = async () => {
      const tokenDetails = await getAssetData(asset, chainId);
      const hashedArgs = idHash([
        chainId,
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
        blockNumber: block,
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
  }, [asset, chainId, block]);

  return { ...state, value: state.value === null ? Decimal.ZERO : state.value };
};
