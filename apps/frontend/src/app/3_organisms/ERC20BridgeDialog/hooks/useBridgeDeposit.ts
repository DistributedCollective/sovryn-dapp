import { useQuery, useMutation } from '@tanstack/react-query';

import { useCallback, useState, useEffect } from 'react';

import { ethers } from 'ethers';

import { ChainIds } from '@sovryn/ethers-provider';
import {
  BridgeLimits,
  BridgeTransaction,
  CrossBridgeAsset,
  TxStep,
} from '@sovryn/sdk';

import { useBridgeService } from './useBridgeService';

interface UseBridgeDepositParams {
  sourceChain: ChainIds;
  targetChain: ChainIds;
  asset: CrossBridgeAsset;
  account?: string;
}

interface UseBridgeDepositReturn {
  limits: BridgeLimits | undefined;
  isLoadingLimits: boolean;
  limitsError: Error | null;
  balance: string | undefined;
  isLoadingBalance: boolean;
  balanceError: Error | null;
  allowance: string | undefined;
  isLoadingAllowance: boolean;
  allowanceError: Error | null;
  transaction: BridgeTransaction;
  approve: (amount: string, spender?: string) => Promise<void>;
  deposit: (amount: string, receiver?: string) => Promise<void>;
  resetTransaction: () => void;
  needsApproval: (amount: string, spender?: string) => boolean;
  canDeposit: (amount: string) => boolean;
  estimateGas: (amount: string, receiver?: string) => Promise<ethers.BigNumber>;
  refetchLimits: () => void;
  refetchBalance: () => void;
  refetchAllowance: () => void;
}

export function useBridgeDeposit({
  sourceChain,
  targetChain,
  asset,
  account,
}: UseBridgeDepositParams): UseBridgeDepositReturn {
  const bridgeService = useBridgeService();
  const [transaction, setTransaction] = useState<BridgeTransaction>({
    step: TxStep.IDLE,
  });

  const bridgeConfig = bridgeService?.getBridgeConfig(sourceChain, targetChain);
  const assetConfig = bridgeService?.getAssetConfig(
    sourceChain,
    targetChain,
    asset,
  );

  const spenderAddress = useCallback(() => {
    if (!bridgeConfig || !assetConfig) return undefined;

    if (
      [ChainIds.RSK_MAINNET, ChainIds.RSK_TESTNET].includes(sourceChain) &&
      assetConfig.usesAggregator
    ) {
      return assetConfig.aggregatorContractAddress;
    }

    return bridgeConfig.bridgeContractAddress;
  }, [sourceChain, bridgeConfig, assetConfig]);

  const {
    data: limitsData,
    isLoading: isLoadingLimits,
    error: limitsError,
    refetch: refetchLimits,
  } = useQuery({
    queryKey: ['bridgeLimits', sourceChain, targetChain, asset],
    queryFn: async () => {
      if (!bridgeService) throw new Error('Bridge service not initialized');
      return bridgeService.getBridgeLimits(sourceChain, targetChain, asset);
    },
    enabled: !!bridgeService && !!bridgeConfig && !!assetConfig,
    refetchInterval: 60_000 * 5, // Refresh every 5 minutes
  });

  const {
    data: balance,
    isLoading: isLoadingBalance,
    error: balanceError,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ['bridgeBalance', sourceChain, asset, account],
    queryFn: async () => {
      if (!bridgeService || !account) throw new Error('Missing requirements');
      return bridgeService.getBalance(sourceChain, asset, account);
    },
    enabled: !!bridgeService && !!account,
    refetchInterval: 30_000,
  });

  const {
    data: allowance,
    isLoading: isLoadingAllowance,
    error: allowanceError,
    refetch: refetchAllowance,
  } = useQuery({
    queryKey: [
      'bridgeAllowance',
      sourceChain,
      asset,
      account,
      spenderAddress(),
    ],
    queryFn: async () => {
      if (!bridgeService || !account || !spenderAddress()) {
        throw new Error('Missing requirements');
      }
      return bridgeService.getAllowance(
        sourceChain,
        asset,
        account,
        spenderAddress()!,
      );
    },
    enabled:
      !!bridgeService &&
      !!account &&
      !!spenderAddress() &&
      !assetConfig?.isNative,
    refetchInterval: 30_000,
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

      setTransaction({ step: TxStep.APPROVING });

      try {
        const tx = await bridgeService.approve(
          sourceChain,
          asset,
          spender,
          amount,
        );
        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error('Approval transaction failed');
        }

        return receipt;
      } catch (error: any) {
        if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
          setTransaction({ step: TxStep.USER_DENIED, error });
        } else {
          setTransaction({ step: TxStep.FAILED, error });
        }
        throw error;
      }
    },
    onSuccess: receipt => {
      setTransaction({
        step: TxStep.APPROVED,
        approveHash: receipt.transactionHash,
      });
      refetchAllowance();
    },
    onError: (error: Error) => {
      if (transaction.step !== TxStep.USER_DENIED) {
        setTransaction({ step: TxStep.FAILED, error });
      }
    },
  });

  const depositMutation = useMutation({
    mutationFn: async ({
      amount,
      receiver,
    }: {
      amount: string;
      receiver?: string;
    }) => {
      if (!bridgeService) throw new Error('Bridge service not initialized');

      setTransaction(prev => ({
        ...prev,
        step: TxStep.CONFIRMING,
      }));

      try {
        const tx = await bridgeService.deposit({
          sourceChain,
          targetChain,
          asset,
          amount,
          receiver,
        });

        setTransaction(prev => ({
          ...prev,
          step: TxStep.PENDING,
          transferHash: tx.hash,
        }));

        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error('Deposit transaction failed');
        }

        return receipt;
      } catch (error: any) {
        if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
          setTransaction(prev => ({
            ...prev,
            step: TxStep.USER_DENIED,
            error,
          }));
        } else {
          setTransaction(prev => ({
            ...prev,
            step: TxStep.FAILED,
            error,
          }));
        }
        throw error;
      }
    },
    onSuccess: receipt => {
      setTransaction(prev => ({
        ...prev,
        step: TxStep.CONFIRMED,
        transferHash: receipt.transactionHash,
      }));
      refetchBalance();
    },
    onError: (error: Error) => {
      if (transaction.step !== TxStep.USER_DENIED) {
        setTransaction(prev => ({
          ...prev,
          step: TxStep.FAILED,
          error,
        }));
      }
    },
  });

  const approve = useCallback(
    async (amount: string, spender?: string) => {
      const targetSpender = spender || spenderAddress();
      if (!targetSpender) throw new Error('No spender address');

      await approveMutation.mutateAsync({ amount, spender: targetSpender });
    },
    [approveMutation, spenderAddress],
  );

  const resetTransaction = useCallback(() => {
    setTransaction({ step: TxStep.IDLE });
  }, []);

  const needsApproval = useCallback(
    (amount: string, spender?: string): boolean => {
      if (!assetConfig || assetConfig.isNative) return false;
      if (!allowance) return true;

      try {
        const amountBN = ethers.BigNumber.from(amount);
        const allowanceBN = ethers.BigNumber.from(allowance);
        return amountBN.gt(allowanceBN);
      } catch {
        return true;
      }
    },
    [assetConfig, allowance],
  );

  const deposit = useCallback(
    async (amount: string, receiver?: string) => {
      if (needsApproval(amount)) {
        throw new Error('Approval required before deposit');
      }

      await depositMutation.mutateAsync({ amount, receiver });
    },
    [depositMutation, needsApproval],
  );

  const canDeposit = useCallback(
    (amount: string): boolean => {
      if (!balance || !limitsData) return false;

      try {
        const amountBN = ethers.BigNumber.from(amount);
        const balanceBN = ethers.BigNumber.from(balance);
        const minBN = ethers.BigNumber.from(limitsData.minPerToken);
        const maxBN = ethers.BigNumber.from(limitsData.maxTokensAllowed);

        return (
          amountBN.gt(0) &&
          amountBN.lte(balanceBN) &&
          amountBN.gte(minBN) &&
          amountBN.lte(maxBN)
        );
      } catch {
        return false;
      }
    },
    [balance, limitsData],
  );

  const estimateGas = useCallback(
    async (amount: string, receiver?: string): Promise<ethers.BigNumber> => {
      if (!bridgeService) throw new Error('Bridge service not initialized');

      return bridgeService.estimateDepositGas({
        sourceChain,
        targetChain,
        asset,
        amount,
        receiver,
      });
    },
    [bridgeService, sourceChain, targetChain, asset],
  );

  useEffect(() => {
    resetTransaction();
  }, [sourceChain, targetChain, asset, resetTransaction]);

  return {
    limits: limitsData,
    isLoadingLimits,
    limitsError: limitsError as Error | null,
    balance,
    isLoadingBalance,
    balanceError: balanceError as Error | null,
    allowance,
    isLoadingAllowance,
    allowanceError: allowanceError as Error | null,
    transaction,
    approve,
    deposit,
    resetTransaction,
    needsApproval,
    canDeposit,
    estimateGas,
    refetchLimits,
    refetchBalance,
    refetchAllowance,
  };
}
