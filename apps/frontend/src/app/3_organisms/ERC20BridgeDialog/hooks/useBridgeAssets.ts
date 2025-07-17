import { useMemo } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';

import { useBridgeService } from './useBridgeService';

export const useAssetsBySourceChain = (
  sourceChainId: typeof ChainIds | undefined,
) => {
  const bridgeService = useBridgeService();

  return useMemo(() => {
    if (!sourceChainId) return [];

    try {
      return bridgeService.getAssetsBySourceChain(sourceChainId);
    } catch (error) {
      console.error('Error getting assets by source chain:', error);
      return [];
    }
  }, [bridgeService, sourceChainId]);
};

export const useAssetsByTargetChain = (
  targetChainId: typeof ChainIds | undefined,
) => {
  const bridgeService = useBridgeService();

  return useMemo(() => {
    if (!targetChainId) return [];

    try {
      return bridgeService.getAssetsByTargetChain(targetChainId);
    } catch (error) {
      console.error('Error getting assets by target chain:', error);
      return [];
    }
  }, [bridgeService, targetChainId]);
};
