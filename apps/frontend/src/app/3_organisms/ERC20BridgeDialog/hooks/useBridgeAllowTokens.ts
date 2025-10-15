import { useQuery } from '@tanstack/react-query';

import { ChainId } from '@sovryn/ethers-provider';

import { useBridgeService } from './useBridgeService';

export function useBridgeAllowTokens(
  sourceChain: ChainId | undefined,
  targetChain: ChainId | undefined,
) {
  const bridgeService = useBridgeService();
  return useQuery({
    queryKey: ['bridgeAllowToken', sourceChain, targetChain],
    queryFn: () =>
      bridgeService.getBridgeAllowTokens(sourceChain!, targetChain!),
    enabled: Boolean(bridgeService && sourceChain && targetChain),
    refetchInterval: 60_000 * 10,
  });
}
