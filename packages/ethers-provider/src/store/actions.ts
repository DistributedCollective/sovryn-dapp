import { dispatch } from '.';
import type {
  AddChainsAction,
  Chain,
  ResetStoreAction,
  UpdateChainAction,
} from '../types';
import { ADD_CHAINS, RESET_STORE, UPDATE_CHAIN } from './constants';

export const addChains = (chains: Chain[]) => {
  const action = {
    type: ADD_CHAINS,
    payload: chains.map(({ id, ...rest }) => ({
      ...rest,
      id: id.toLowerCase(),
    })),
  };
  dispatch(action as AddChainsAction);
};

export const updateChain = (chain: Chain) => {
  const action = {
    type: UPDATE_CHAIN,
    payload: {
      ...chain,
      id: chain.id.toLowerCase(),
    },
  };
  dispatch(action as UpdateChainAction);
};

export const resetStore = () => {
  const action = {
    type: RESET_STORE,
    payload: undefined,
  };
  dispatch(action as ResetStoreAction);
};
