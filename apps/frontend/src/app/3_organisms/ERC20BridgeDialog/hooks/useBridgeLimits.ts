import { useQuery } from '@tanstack/react-query';

import { ChainId } from '@sovryn/ethers-provider';

import { useBridgeAllowTokens } from './useBridgeAllowTokens';
import { useBridgeService } from './useBridgeService';

export function useBridgeLimits(
  sourceChain: ChainId | undefined,
  targetChain: ChainId | undefined,
  asset: string | undefined,
) {
  const bridgeService = useBridgeService();
  const { data: allowTokens } = useBridgeAllowTokens(sourceChain, targetChain);

  return useQuery({
    queryKey: ['bridgeLimits', sourceChain, targetChain, asset, allowTokens],
    queryFn: async () => {
      try {
        return await bridgeService.getBridgeLimits(
          sourceChain!,
          targetChain!,
          asset!,
          allowTokens!,
        );
      } catch (error) {
        console.error('Error fetching bridge limits:', error);
      }
    },
    enabled: Boolean(
      bridgeService && sourceChain && targetChain && asset && allowTokens,
    ),
    refetchInterval: 60_000 * 10,
  });
}
