import type { ConnectionInfo } from 'ethers/lib/utils';
import type { ChainIds } from './chains';

export type ChainId = ChainIds | string;

export interface Chain {
  id: ChainId;
  rpcUrl: string;
  label: string;
  providerConnectionInfo?: ConnectionInfo;
  blockExplorerUrl?: string;
}

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
