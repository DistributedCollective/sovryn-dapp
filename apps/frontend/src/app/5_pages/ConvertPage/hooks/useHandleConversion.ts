import { useCallback, useMemo } from 'react';

import { ethers, BigNumber } from 'ethers';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';

import { defaultChainId } from '../../../../config/chains';

import { Transaction } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { GAS_LIMIT_CONVERT } from '../../../../utils/constants';
import { toWei } from '../../../../utils/math';

export const useHandleConversion = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
  amount: string,
) => {
  const { account, signer } = useAccount();
  const weiAmount = useMemo(() => toWei(amount), [amount]);

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const getMassetManager = useCallback(async () => {
    const { address: massetManagerAddress, abi: massetManagerAbi } =
      await getProtocolContract('massetManager', defaultChainId);

    return new ethers.Contract(massetManagerAddress, massetManagerAbi, signer);
  }, [signer]);

  const getWithdrawTokensTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress } = await getTokenDetails(
      destinationToken,
      defaultChainId,
    );

    return [
      {
        title: 'Redeem DLLR for bAsset',
        contract: massetManager,
        fnName: 'redeemTo',
        args: [bassetAddress, weiAmount, account],
        config: { gasLimit: GAS_LIMIT_CONVERT },
      },
    ];
  }, [account, destinationToken, getMassetManager, weiAmount]);

  const withdrawTokens = useCallback(async () => {
    if (!signer || sourceToken !== SupportedTokens.dllr) {
      return;
    }

    const transactions = await getWithdrawTokensTransactions();
    setTransactions(transactions);

    setTitle('DLLR to bAsset conversion');
    setIsOpen(true);
  }, [
    getWithdrawTokensTransactions,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
    sourceToken,
  ]);

  const getDepositTokenTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress, abi: bassetAbi } = await getTokenDetails(
      sourceToken,
      defaultChainId,
    );

    const bassetToken = new ethers.Contract(bassetAddress, bassetAbi, signer);

    const allowance = await bassetToken.allowance(
      account,
      massetManager.address,
    );

    const transactions: Transaction[] = [];

    if (BigNumber.from(allowance).lt(weiAmount)) {
      transactions.push({
        title: 'Approve',
        contract: bassetToken,
        fnName: 'approve',
        args: [massetManager.address, weiAmount],
      });
    }

    transactions.push({
      title: 'Deposit bAsset for DLLR',
      contract: massetManager,
      fnName: 'mintTo',
      args: [bassetAddress, weiAmount, account],
      config: { gasLimit: GAS_LIMIT_CONVERT },
    });

    return transactions;
  }, [account, getMassetManager, signer, sourceToken, weiAmount]);

  const depositTokens = useCallback(async () => {
    if (!signer || destinationToken !== SupportedTokens.dllr) {
      return;
    }
    const transactions = await getDepositTokenTransactions();

    setTransactions(transactions);
    setTitle('bAsset to DLLR conversion');
    setIsOpen(true);
  }, [
    signer,
    destinationToken,
    getDepositTokenTransactions,
    setTransactions,
    setTitle,
    setIsOpen,
  ]);

  const handleSubmit = useCallback(() => {
    sourceToken === SupportedTokens.dllr ? withdrawTokens() : depositTokens();
  }, [depositTokens, withdrawTokens, sourceToken]);

  return {
    handleSubmit,
    getDepositTokenTransactions,
    getWithdrawTokensTransactions,
  };
};
