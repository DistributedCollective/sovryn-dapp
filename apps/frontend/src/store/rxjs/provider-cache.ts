import { hashMessage } from 'ethers/lib/utils';
import {
  BehaviorSubject,
  distinctUntilKeyChanged,
  map,
  filter,
  firstValueFrom,
} from 'rxjs';

import { ChainId, getProvider } from '@sovryn/ethers-provider';

export type CacheCallResponse<T = string> = {
  value: T;
  loading: boolean;
  error: Error | null;
};

type SubjectState = {
  pending: boolean;
  timestamp: number;
  ttl: number;
  blockNumber: number;
  promise: Promise<any>;
  result: CacheCallResponse<any>;
  /** Identifies the read this entry is currently waiting on. */
  generation: number;
};

type SubjectMap = {
  [id: string]: SubjectState;
};

export type CacheCallOptions = {
  // time to live in miliseconds
  ttl: number;
  force: boolean;
  // when data expires or needs to be refreshed forcely, show previous successful result while loading
  fallbackToPreviousResult: boolean;
  // if given block number is higher than current block number, data is considered expired
  blockNumber: number;
};

const INITIAL_STATE: SubjectMap = {};
const DEFAULT_TTL = 1000 * 60 * 2; // 2 minutes
const TINY_TTL = 1000 * 30; // 30 seconds

const store = new BehaviorSubject<SubjectMap>(INITIAL_STATE);

const mergeOptions = (options: Partial<CacheCallOptions>) => ({
  ttl: options.ttl ?? DEFAULT_TTL,
  blockNumber: options.blockNumber ?? 0,
  force: options.force ?? false,
  fallbackToPreviousResult: options.fallbackToPreviousResult ?? true,
});

export const startCall = <T>(
  id: string,
  promise: () => Promise<T>,
  options: Partial<CacheCallOptions> = {},
) => {
  options = mergeOptions(options);

  const state = store.getValue();

  const now = Date.now();

  if (
    state.hasOwnProperty(id) &&
    state[id].ttl > now &&
    (state[id].blockNumber || 0) >= (options.blockNumber || 0) &&
    !options.force
  ) {
    return;
  }

  // Each call started for this id gets the next generation, so a completion
  // can be told apart from one belonging to a call this one has superseded.
  const generation = (state[id]?.generation ?? 0) + 1;

  const promise$ = promise()
    .then(result => {
      completeCall(id, result, null, generation);
      return result;
    })
    .catch(error => {
      completeCall(id, null, error, generation);
      return error;
    });

  let result: CacheCallResponse<any> = {
    value: null,
    loading: true,
    error: null,
  };

  if (options.fallbackToPreviousResult) {
    const cached = state[id];
    if (cached && !cached.result?.error) {
      result = cached.result;
    }
  }

  store.next({
    ...state,
    [id]: {
      pending: true,
      timestamp: now,
      ttl: now + (options?.ttl ?? DEFAULT_TTL),
      blockNumber: options?.blockNumber ?? 0,
      promise: promise$,
      result,
      generation,
    },
  });
};

export const completeCall = (
  id: string,
  result: any,
  error: Error | null,
  generation: number,
) => {
  const state = store.getValue();

  // A completion belongs to the call it was started for. One that arrives
  // after a newer call has already started on the same id is from a read
  // this entry has moved past, and must not overwrite the newer one's
  // bookkeeping or answer.
  if (!state.hasOwnProperty(id) || state[id].generation !== generation) {
    return;
  }

  store.next({
    ...state,
    [id]: {
      ...state[id],
      pending: false,
      result: {
        loading: false,
        value: result,
        error,
      },
    },
  });
};

export const observeCall = (id: string) => {
  return store.asObservable().pipe(
    distinctUntilKeyChanged(id),
    map(state => state[id]),
    filter(state => state !== undefined),
  );
};

export const idHash = (args: any[]) => {
  const params = args.map(item => item.toString().toLowerCase());
  const json = JSON.stringify(params);
  return hashMessage(json);
};

export const asyncCall = async <T>(
  id: string,
  promise: () => Promise<T>,
  options: Partial<CacheCallOptions> = {},
) => {
  const result$ = observeCall(id);

  startCall(id, promise, options);

  return (await firstValueFrom(result$)).promise.then(e => {
    if (e instanceof Error) {
      throw e;
    }
    return e;
  });
};

export const getBlockNumber = async (
  chainId: ChainId = getBlockNumber(),
): Promise<number> =>
  asyncCall(
    `${chainId}_blockNumber`,
    () => getProvider(chainId).getBlockNumber(),
    { ttl: TINY_TTL },
  );
