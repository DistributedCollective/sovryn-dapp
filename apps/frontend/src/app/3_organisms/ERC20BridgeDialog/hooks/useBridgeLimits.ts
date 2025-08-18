import { useQuery } from '@tanstack/react-query';

import { ChainId } from '@sovryn/ethers-provider';

import { useBridgeService } from './useBridgeService';

export function useBridgeLimits(
  sourceChain: ChainId | undefined,
  targetChain: ChainId | undefined,
  asset: string | undefined,
) {
  const bridgeService = useBridgeService();
  return useQuery({
    queryKey: ['bridgeLimits', sourceChain, targetChain, asset],
    queryFn: async () => {
      try {
        return await bridgeService.getBridgeLimits(
          sourceChain!,
          targetChain!,
          asset!,
        );
      } catch (error) {
        console.error('Error fetching bridge limits:', error);
      }
    },
    enabled: Boolean(bridgeService && sourceChain && targetChain && asset),
    refetchInterval: 60_000 * 10,
  });
}
