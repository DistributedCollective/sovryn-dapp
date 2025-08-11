import { BlockedAmbientPoolConfig } from './AmbientMarketMaking.types';

/**
 * Configuration for Ambient pools that have deposits locked.
 * Note: This configuration applies to all chains where the pool exists.
 */
export const BLOCKED_AMBIENT_POOLS: BlockedAmbientPoolConfig[] = [
  {
    poolAssetA: 'DAI',
    poolAssetB: 'SOV',
    message:
      'DAI/SOV pool deposits are temporarily disabled (testing message, needs to be removed before merging)',
  },
];
