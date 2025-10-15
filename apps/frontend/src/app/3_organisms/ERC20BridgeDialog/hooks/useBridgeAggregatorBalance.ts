import { useQuery } from '@tanstack/react-query';

import { ChainId } from '@sovryn/ethers-provider';

import { useAccount } from '../../../../hooks';
import { useBridgeService } from './useBridgeService';

export function useBridgeAggregatorBalance(
  sourceChain: ChainId | undefined,
  targetChain: ChainId | undefined,
  asset: string | undefined,
) {
  const bridgeService = useBridgeService();
  const { account } = useAccount();

  return useQuery({
    queryKey: ['aggregatorBalance', sourceChain, targetChain, asset, account],
    queryFn: async () => {
      try {
        return await bridgeService.getBridgeAggregatorBalance(
          sourceChain!,
          targetChain!,
          asset!,
          account!,
        );
      } catch (error) {
        console.log('Error fetching aggregator balance:', error);
        return '0';
      }
    },
    enabled: Boolean(
      bridgeService && sourceChain && targetChain && asset && account,
    ),
    refetchInterval: 60_000 * 10,
  });
}
