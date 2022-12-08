import { useEffect, useMemo, useState } from 'react';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

import {
  CacheCallOptions,
  CacheCallResponse,
  idHash,
  observeCall,
  startCall,
} from '../store/rxjs/provider-cache';
import { getRskChainId } from '../utils/chain';
import { useIsMounted } from './useIsMounted';

const DEFAULT_BLOCK_TTL = 30 * 1000; // 30 seconds

export const useBlockNumber = (
  chainId: ChainId = getRskChainId(),
  options: Partial<CacheCallOptions> = { ttl: DEFAULT_BLOCK_TTL },
): CacheCallResponse<number> => {
  const isMounted = useIsMounted();

  const [state, setState] = useState<CacheCallResponse<number>>({
    value: 0,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    const hashedArgs = idHash([chainId, 'blockNumber']);

    const sub = observeCall(hashedArgs).subscribe(e => setState(e.result));

    startCall(hashedArgs, () => getProvider(chainId).getBlockNumber(), options);

    return () => {
      sub.unsubscribe();
    };
  }, [chainId, isMounted, options]);

  return useMemo(
    () => ({ ...state, value: state.value === null ? 0 : state.value }),
    [state],
  );
};
