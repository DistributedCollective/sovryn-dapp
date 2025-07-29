import { useQuery } from '@tanstack/react-query';

import { ChainId } from '@sovryn/ethers-provider';

import { useBridgeService } from './useBridgeService';

export function useBridgeAggregatorBalance(
  sourceChain: ChainId | undefined,
  targetChain: ChainId | undefined,
  asset: string | undefined,
) {
  const bridgeService = useBridgeService();

  return useQuery({
    queryKey: ['aggregatorBalance', sourceChain, targetChain, asset],
    queryFn: async () => {
      try {
        return await bridgeService.getBridgeAggregatorBalance(
          sourceChain!,
          targetChain!,
          asset!,
        );
      } catch (error) {
        console.log('Error fetching aggregator balance:', error);
        return '0';
      }
    },
    enabled: Boolean(bridgeService && sourceChain && targetChain && asset),
    refetchInterval: 60_000 * 10,
  });
}
