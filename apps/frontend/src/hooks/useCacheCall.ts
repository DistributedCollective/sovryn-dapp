import { DependencyList, useEffect, useMemo, useState } from 'react';

import { Subscription } from 'rxjs';

import { defaultChainId } from '../config/chains';

import {
  CacheCallOptions,
  observeCall,
  startCall,
} from '../store/rxjs/provider-cache';
import { useBlockNumber } from './useBlockNumber';
import { useIsMounted } from './useIsMounted';

type State<T> = {
  value: T;
  loading: boolean;
  error: Error | null;
};

export const useCacheCall = <T>(
  key: string,
  callback: () => Promise<T>,
  deps?: DependencyList,
  defaultValue?: T,
  options?: Partial<CacheCallOptions>,
): State<T> => {
  const isMounted = useIsMounted();
  const { value: block } = useBlockNumber(defaultChainId);

  const [state, setState] = useState<State<T>>({
    value: defaultValue ?? (null as T),
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!isMounted() || !block) {
      return;
    }

    let sub: Subscription;

    sub = observeCall(`call:${key}`).subscribe(e => {
      if (isMounted()) {
        setState({
          ...e.result,
          value: e.result.value ?? defaultValue ?? (null as T),
        });
      }
    });

    try {
      startCall(`call:${key}`, callback, {
        ...options,
        blockNumber: options?.blockNumber || block,
      });
    } catch (e) {}

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block, key, JSON.stringify(deps)]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => state, [JSON.stringify(state)]);
};
