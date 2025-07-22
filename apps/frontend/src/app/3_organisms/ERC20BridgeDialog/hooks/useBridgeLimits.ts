import { useQuery, useMutation } from '@tanstack/react-query';

import { ChainIds } from '@sovryn/ethers-provider';

import { useAccount } from '../../../../hooks';
import { useBridgeService } from './useBridgeService';

export function useBridgeLimits(
  sourceChain: ChainIds | undefined,
  targetChain: ChainIds | undefined,
  asset: string | undefined,
) {
  const bridgeService = useBridgeService();
  const { signer } = useAccount();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bridgeLimits', sourceChain, targetChain, asset],
    queryFn: async () => {
      if (!bridgeService || !sourceChain || !targetChain || !asset)
        throw new Error('Bridge service not initialized');

      const limits = await bridgeService.getBridgeLimits(
        sourceChain,
        targetChain,
        asset,
      );

      return {
        returnData: limits,
      };
    },
    enabled: Boolean(bridgeService && sourceChain && targetChain && asset),
    refetchInterval: 60_000 * 10, // Refresh 10 minutes
  });
  const { data: aggregatorBalance } = useQuery({
    queryKey: ['aggregatorBalance', sourceChain, targetChain, asset],
    queryFn: async () => {
      if (!bridgeService || !sourceChain || !targetChain || !asset)
        throw new Error('Bridge service not initialized');

      return await bridgeService.getBridgeAggregatorBalance(
        sourceChain,
        targetChain,
        asset,
      );
    },
    enabled: Boolean(bridgeService && sourceChain && targetChain && asset),
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
      if (!bridgeService || !signer || !sourceChain || !asset)
        throw new Error('Bridge service not initialized');
      return bridgeService.approve(sourceChain, asset, spender, amount, signer);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const depositMutation = useMutation({
    mutationFn: async (params: { amount: string; receiver?: string }) => {
      if (!bridgeService || !signer || !sourceChain || !targetChain || !asset)
        throw new Error('Bridge service not initialized');
      return bridgeService.deposit({
        sourceChain,
        targetChain,
        asset,
        amount: params.amount,
        receiver: params.receiver,
        signer,
      });
    },
    onSuccess: () => {
      refetch();
    },
  });

  return {
    data: data,
    aggregatorBalance,
    isLoading,
    error,
    refetch,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    deposit: depositMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
  };
}
