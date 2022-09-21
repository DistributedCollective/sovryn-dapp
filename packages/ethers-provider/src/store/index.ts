import {
  BehaviorSubject,
  distinctUntilKeyChanged,
  filter,
  map,
  Observable,
  Subject,
} from 'rxjs';

import { APP_INITIAL_STATE } from '../constants';
import { Action, AppState, Chain } from '../types';
import { ADD_CHAINS, RESET_STORE, UPDATE_CHAIN } from './constants';

const store = new BehaviorSubject<AppState>(APP_INITIAL_STATE);
const stateUpdates = new Subject<AppState>();

stateUpdates.subscribe(store);

function reducer(state: AppState, action: Action): AppState {
  const { type, payload } = action;

  switch (type) {
    case ADD_CHAINS:
      return {
        ...state,
        chains: [...state.chains, ...(payload as Chain[])],
      };

    case UPDATE_CHAIN:
      const chains = state.chains;
      const current = chains.findIndex(({ id }) => id === payload.id);

      if (current !== -1) {
        chains[current] = payload as Chain;
      } else {
        chains.push(payload as Chain);
      }

      return {
        ...state,
        chains,
      };

    case RESET_STORE:
      return APP_INITIAL_STATE;

    default:
      throw new Error(`Unknown type: ${type} in appStore reducer`);
  }
}

export const dispatch = (action: Action) => {
  const state = store.getValue();
  stateUpdates.next(reducer(state, action));
};

function select(): Observable<AppState>;
function select<T extends keyof AppState>(stateKey: T): Observable<AppState[T]>;
function select<T extends keyof AppState>(
  stateKey?: keyof AppState,
): Observable<AppState[T]> | Observable<AppState> {
  if (!stateKey) {
    return stateUpdates.asObservable();
  }

  const validStateKeys = Object.keys(store.getValue());

  if (!validStateKeys.includes(String(stateKey))) {
    throw new Error(`key: ${stateKey} does not exist on this store`);
  }

  return stateUpdates.asObservable().pipe(
    distinctUntilKeyChanged(stateKey),
    map(x => x?.[stateKey]),
    filter(item => item != null),
  ) as Observable<AppState[T]>;
}

function get(): AppState {
  return store.getValue();
}

export const state = {
  select,
  get,
};
