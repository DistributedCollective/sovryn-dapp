import { useQuery } from '@tanstack/react-query';

import { useCallback, useState, useEffect, useMemo } from 'react';

import { BigNumberish, ethers } from 'ethers';

import { ChainIds, ChainId } from '@sovryn/ethers-provider';
import { BridgeTransaction, CrossBridgeAsset, TxStep } from '@sovryn/sdk';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import { useAccount } from '../../../../hooks';
import { useBridgeLimits } from './useBridgeLimits';
import { useBridgeService } from './useBridgeService';
import { useTokenBalance } from './useTokenBalance';

interface UseBridgeSendParams {
  sourceChain: ChainId;
  targetChain: ChainId;
  asset: string;
  amount: BigNumberish;
  receiver?: string;
}

export function useBridgeSend({
  sourceChain,
  targetChain,
  asset,
  amount,
  receiver,
}: UseBridgeSendParams) {
  const bridgeService = useBridgeService();
  const { account, signer } = useAccount();
  const [transaction, setTransaction] = useState<BridgeTransaction>({
    step: TxStep.IDLE,
  });

  const bridgeConfig = useMemo(
    () => bridgeService?.getBridgeConfig(sourceChain, targetChain),
    [bridgeService, sourceChain, targetChain],
  );

  const assetConfig = useMemo(
    () => bridgeService?.getAssetConfig(sourceChain, targetChain, asset),
    [bridgeService, sourceChain, targetChain, asset],
  );

  const spenderAddress = useMemo(() => {
    if (!bridgeConfig || !assetConfig) return undefined;

    // For RSK chain with aggregator
    if (
      sourceChain === RSK_CHAIN_ID &&
      assetConfig.usesAggregator &&
      assetConfig.aggregatorContractAddress
    ) {
      return assetConfig.aggregatorContractAddress;
    }

    return bridgeConfig.bridgeContractAddress;
  }, [sourceChain, bridgeConfig, assetConfig]);

  // Fetch allowance
  const { data: allowance, refetch: refetchAllowance } = useQuery({
    queryKey: ['bridgeAllowance', sourceChain, asset, account, spenderAddress],
    queryFn: async () => {
      if (!bridgeService || !account || !spenderAddress) {
        throw new Error('Missing requirements');
      }
      return bridgeService.getAllowance(
        sourceChain,
        asset,
        account,
        spenderAddress,
      );
    },
    enabled:
      !!bridgeService &&
      !!account &&
      !!spenderAddress &&
      !assetConfig?.isNative,
  });

  const { data: balance } = useTokenBalance(asset, sourceChain);
  const { data: limits } = useBridgeLimits(RSK_CHAIN_ID, targetChain, asset);

  const requiresApproval = useMemo(() => {
    if (!assetConfig || assetConfig.isNative) return false;
    if (!allowance || !amount) return false;

    try {
      const amountBN = ethers.BigNumber.from(amount);
      const allowanceBN = ethers.BigNumber.from(allowance);
      return amountBN.gt(allowanceBN);
    } catch {
      return true;
    }
  }, [assetConfig, allowance, amount]);

  const canDeposit = useMemo(() => {
    if (!balance || !limits || !amount) return false;

    try {
      const amountBN = ethers.BigNumber.from(amount);
      const balanceBN = ethers.BigNumber.from(balance);
      const minBN = ethers.BigNumber.from(limits.minPerToken);
      const maxBN = ethers.BigNumber.from(limits.maxTokensAllowed);

      return (
        amountBN.gt(0) &&
        amountBN.lte(balanceBN) &&
        amountBN.gte(minBN) &&
        amountBN.lte(maxBN)
      );
    } catch (error) {
      console.log('Error in canDeposit calculation:', error);
      return false;
    }
  }, [balance, limits, amount]);

  const handleApproval = useCallback(async (): Promise<void> => {
    if (!bridgeService || !signer || !spenderAddress) {
      throw new Error('Missing requirements for approval');
    }

    setTransaction({ step: TxStep.APPROVING });

    try {
      // Special handling for USDT on ETH (reset allowance to 0 first)
      if (
        [ChainIds.MAINNET, ChainIds.ROPSTEN].includes(
          sourceChain as ChainIds,
        ) &&
        asset === CrossBridgeAsset.USDT
      ) {
        const currentAllowance = await bridgeService.getAllowance(
          sourceChain,
          asset,
          account!,
          spenderAddress,
        );

        if (currentAllowance !== '0') {
          const resetTx = await bridgeService.approve(
            sourceChain,
            asset,
            spenderAddress,
            '0',
            signer,
          );
          await resetTx.wait();
        }
      }

      const tx = await bridgeService.approve(
        sourceChain,
        asset,
        spenderAddress,
        amount.toString(),
        signer,
      );

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error('Approval transaction failed');
      }

      refetchAllowance();

      setTransaction({
        step: TxStep.APPROVED,
        approveHash: receipt.transactionHash,
      });
    } catch (error: any) {
      if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
        setTransaction({ step: TxStep.USER_DENIED, error });
      } else {
        setTransaction({ step: TxStep.FAILED, error });
      }
      throw error;
    }
  }, [
    bridgeService,
    signer,
    spenderAddress,
    sourceChain,
    asset,
    amount,
    refetchAllowance,
    account,
  ]);

  const handleDeposit = useCallback(async (): Promise<void> => {
    if (!bridgeService || !signer) {
      throw new Error('Missing requirements for deposit');
    }

    setTransaction(prev => ({
      ...prev,
      step: TxStep.CONFIRMING,
    }));

    try {
      const tx = await bridgeService.deposit({
        sourceChain,
        targetChain,
        asset,
        amount: amount.toString(),
        receiver: receiver || account!,
        signer,
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

      setTransaction(prev => ({
        ...prev,
        step: TxStep.CONFIRMED,
        transferHash: receipt.transactionHash,
      }));
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
  }, [
    bridgeService,
    signer,
    sourceChain,
    targetChain,
    asset,
    amount,
    receiver,
    account,
  ]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    try {
      setTransaction({ step: TxStep.IDLE });

      if (!canDeposit) {
        throw new Error(
          'Cannot proceed with deposit: insufficient balance or amount out of limits',
        );
      }

      if (requiresApproval) {
        await handleApproval();
        await handleDeposit();
      } else {
        // Direct deposit for native assets or when allowance is sufficient
        await handleDeposit();
      }
    } catch (error) {
      console.error('Bridge transfer failed:', error);
    }
  }, [canDeposit, requiresApproval, handleApproval, handleDeposit]);

  // Reset transaction when parameters change
  useEffect(() => {
    setTransaction({ step: TxStep.IDLE });
  }, [sourceChain, targetChain, asset]);

  return {
    handleSubmit,
    transaction,
    requiresApproval,
    canDeposit,
  };
}
