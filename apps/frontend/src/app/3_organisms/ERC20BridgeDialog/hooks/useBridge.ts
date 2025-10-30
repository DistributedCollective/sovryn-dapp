import { useQuery } from '@tanstack/react-query';

import { useCallback, useState, useEffect, useMemo } from 'react';

import { ethers } from 'ethers';

import { BridgeParams, BridgeTransaction, TxStep } from '@sovryn/sdk';

import { useAccount } from '../../../../hooks';
import { isRskChain } from '../../../../utils/chain';
import { useBridgeService } from './useBridgeService';
import { useBridgeValidation } from './useBridgeValidation';

interface UseBridgeParams extends Omit<BridgeParams, 'signer'> {
  onSuccess?: () => void;
  onTxStart?: () => void;
}

export function useBridge({
  sourceChain,
  targetChain,
  asset,
  amount,
  receiver,
  onSuccess,
  onTxStart,
}: UseBridgeParams) {
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
    if (!bridgeConfig || !assetConfig) {
      return undefined;
    }

    if (isRskChain(sourceChain) && assetConfig.usesAggregator) {
      return assetConfig.aggregatorContractAddress;
    }

    return bridgeConfig.bridgeContractAddress;
  }, [bridgeConfig, assetConfig, sourceChain]);

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

  const { isValid } = useBridgeValidation({
    sourceChain,
    targetChain,
    asset,
    amount,
    receiver,
  });

  const handleApproval = useCallback(async (): Promise<void> => {
    if (!bridgeService || !signer || !spenderAddress) {
      throw new Error('Missing requirements for approval');
    }

    setTransaction({ step: TxStep.APPROVING });

    try {
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
  ]);

  const handleBridge = useCallback(async (): Promise<void> => {
    if (!bridgeService || !signer) {
      throw new Error('Missing requirements for bridge');
    }

    setTransaction(prev => ({
      ...prev,
      step: TxStep.CONFIRMING,
    }));

    try {
      const tx = await bridgeService.bridge({
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
        throw new Error('Bridge transaction failed');
      }

      setTransaction(prev => ({
        ...prev,
        step: TxStep.CONFIRMED,
        transferHash: receipt.transactionHash,
      }));
      onSuccess?.();
    } catch (error: any) {
      console.log({
        error,
      });
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
    onSuccess,
  ]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    try {
      setTransaction({ step: TxStep.IDLE });

      if (!isValid) {
        throw new Error(
          'Cannot proceed with bridge: insufficient balance or amount out of limits',
        );
      }

      onTxStart?.();

      if (requiresApproval) {
        await handleApproval();
      }
      await handleBridge();
    } catch (error) {
      console.error('Bridge transfer failed:', error);
    }
  }, [isValid, onTxStart, requiresApproval, handleBridge, handleApproval]);

  // Reset transaction when parameters change
  useEffect(() => {
    setTransaction({ step: TxStep.IDLE });
  }, [sourceChain, targetChain, asset]);

  return {
    handleSubmit,
    transaction,
    requiresApproval,
    isValid,
  };
}
