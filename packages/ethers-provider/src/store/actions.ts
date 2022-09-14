import { dispatch } from '.';
import { ADD_CHAINS } from './constants';
import type { AddChainsAction, Chain, UpdateChainAction } from '../types';

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
    type: ADD_CHAINS,
    payload: {
      ...chain,
      id: chain.id.toLowerCase(),
    },
  };
  dispatch(action as UpdateChainAction);
};
