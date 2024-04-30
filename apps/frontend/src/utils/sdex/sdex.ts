import { ChainId, ChainIds } from '@sovryn/ethers-provider';
import { CrocEnv } from '@sovryn/sdex';

const crocs: Partial<Record<ChainIds, CrocEnv>> = {};

export const createSdex = (chainId: ChainId) => {
  if (!crocs[chainId]) {
    crocs[chainId] = new CrocEnv(chainId);
  }
  return crocs[chainId] as CrocEnv;
};
