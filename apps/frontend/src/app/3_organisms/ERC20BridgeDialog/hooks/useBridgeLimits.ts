import { useQuery, useMutation } from '@tanstack/react-query';

import { ChainIds } from '@sovryn/ethers-provider';
import { CrossBridgeAsset } from '@sovryn/sdk';

import { useBridgeService } from './useBridgeService';

export function useBridgeLimits(
  sourceChain: ChainIds,
  targetChain: ChainIds,
  asset: CrossBridgeAsset,
) {
  const bridgeService = useBridgeService();

  const queryKey = ['bridgeLimits', sourceChain, targetChain, asset];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!bridgeService) throw new Error('Bridge service not initialized');

      const limits = await bridgeService.getBridgeLimits(
        sourceChain,
        targetChain,
        asset,
      );

      return {
        returnData: limits,
      };
    },
    enabled: !!bridgeService,
    refetchInterval: 60_000 * 10, // Refresh 10 minutes
  });

  const approveMutation = useMutation({
    mutationFn: async ({
      amount,
      spender,
    }: {
      amount: string;
      spender: string;
    }) => {
      if (!bridgeService) throw new Error('Bridge service not initialized');
      return bridgeService.approve(sourceChain, asset, spender, amount);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (params: { amount: string; receiver?: string }) => {
      if (!bridgeService) throw new Error('Bridge service not initialized');
      return bridgeService.deposit({
        sourceChain,
        targetChain,
        asset,
        amount: params.amount,
        receiver: params.receiver,
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    data: data,
    isLoading,
    error,
    refetch,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    deposit: depositMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
  };
}
