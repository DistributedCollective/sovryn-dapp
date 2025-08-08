import { ChainIds } from '@sovryn/ethers-provider';

export type BlockedPoolConfig = {
  poolAssetA: string;
  chainId: ChainIds;
  message: string;
};
