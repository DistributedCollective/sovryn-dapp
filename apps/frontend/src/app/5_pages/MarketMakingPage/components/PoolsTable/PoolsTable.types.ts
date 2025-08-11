import { ChainIds } from '@sovryn/ethers-provider';

export type BlockedPoolConfig = {
  poolAssetA: string;
  poolAssetB: string;
  chainId: ChainIds;
  message: string;
};
