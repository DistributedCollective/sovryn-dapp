import { useCallback, useEffect, useRef, useState } from 'react';

import { ChainId } from '@sovryn/ethers-provider';

import { getIndexer } from '../utils/chain';

type Value<T> = {
  data: T[];
  next?: string;
  timestamp: number;
};

type PaginatedIndexer<T> = {
  response: Value<T>;
  // isFetching is true when it's first time when data is being fetched
  isFetching: boolean;
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
};

type PaginatedIndexerParams<T, Q> = {
  path?: string;
  query?: Q;
  defaultData?: T[];
  enabled?: boolean;
};

export const usePaginatedIndexer = <T, Q = Record<string, unknown>>(
  chainId: ChainId,
  params: PaginatedIndexerParams<T, Q> = {},
) => {
  const controller$ = useRef<AbortController>();

  const [value, setValue] = useState<PaginatedIndexer<T>>({
    response: {
      data: params.defaultData || [],
      next: undefined,
      timestamp: 0,
    },
    isFetching: false,
    isLoading: false,
    isLoaded: false,
    error: null,
  });

  const get = useCallback(
    async (q?: Q) => {
      try {
        if (controller$.current) {
          controller$.current.abort();
        }

        setValue(v => ({
          ...v,
          isFetching: v.isLoaded ? false : true,
          isLoading: true,
          error: null,
        }));

        controller$.current = new AbortController();
        const { signal } = controller$.current;

        const url = new URL(getIndexer(chainId, params.path));
        if (q) {
          Object.entries(q).forEach(([key, value]) => {
            url.searchParams.append(key, value as string);
          });
        }

        const data = await fetch(url, { signal }).then(res => res.json());

        setValue(v => ({
          ...v,
          response: data,
          isFetching: false,
          isLoading: false,
          isLoaded: true,
          error: null,
        }));
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error(e);
          setValue(v => ({
            ...v,
            isFetching: false,
            isLoading: false,
            error: e,
          }));
        }
      }
    },
    [chainId, params.path],
  );

  const fetchNext = useCallback(
    (next?: string) => {
      get({ ...params.query, next: next ?? value?.response?.next } as Q);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [get, value?.response?.next, JSON.stringify(params.query)],
  );

  useEffect(() => {
    if (params.enabled === undefined || params.enabled) {
      get(params.query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get, params.enabled, JSON.stringify(params.query)]);

  return {
    ...value,
    fetch: get,
    fetchNext,
  };
};
