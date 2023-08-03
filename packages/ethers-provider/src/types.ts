import type { ConnectionInfo } from 'ethers/lib/utils';

import type { ChainIds } from './chains';
import { networkMap } from './networks';

export type ChainId = ChainIds | string;

export interface Chain {
  id: ChainId;
  publicRpcUrl: string;
  rpcUrl: string | string[];
  label: string;
  token: string;
  blockExplorerUrl?: string;
  providerConnectionInfo?: ConnectionInfo;
}

export type Network = typeof networkMap[keyof typeof networkMap];

export type AppState = {
  chains: Chain[];
};

// Actions
export type Action = AddChainsAction | UpdateChainAction | ResetStoreAction;

export type AddChainsAction = { type: 'add_chains'; payload: Chain[] };
export type UpdateChainAction = { type: 'update_chain'; payload: Chain };
export type ResetStoreAction = {
  type: 'reset_store';
  payload: unknown;
};
