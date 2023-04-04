import { useCallback, useMemo } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';

import { defaultChainId } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { toWei } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';

export const useHandleConversion = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
  amount: string,
  onComplete: () => void,
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
        title: t(translations.convertPage.txDialog.convert, {
          asset: sourceToken.toUpperCase(),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: massetManager,
          fnName: 'redeemTo',
          args: [bassetAddress, weiAmount, account],
          gasLimit: GAS_LIMIT.CONVERT,
        },
        onComplete,
      },
    ] as Transaction[];
  }, [
    account,
    destinationToken,
    getMassetManager,
    sourceToken,
    weiAmount,
    onComplete,
  ]);

  const withdrawTokens = useCallback(async () => {
    if (!signer || sourceToken !== SupportedTokens.dllr) {
      return;
    }

    const transactions = await getWithdrawTokensTransactions();
    setTransactions(transactions);

    setTitle(
      t(translations.convertPage.txDialog.convertTitle, {
        to: destinationToken.toUpperCase(),
        from: SupportedTokens.dllr.toUpperCase(),
      }),
    );
    setIsOpen(true);
  }, [
    signer,
    sourceToken,
    getWithdrawTokensTransactions,
    setTransactions,
    setTitle,
    destinationToken,
    setIsOpen,
  ]);

  const getDepositTokenTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress, abi: bassetAbi } = await getTokenDetails(
      sourceToken,
      defaultChainId,
    );

    const bassetToken = new ethers.Contract(bassetAddress, bassetAbi, signer);

    const transactions: Transaction[] = [];

    const approveTx = await prepareApproveTransaction({
      token: sourceToken,
      contract: bassetToken,
      spender: massetManager.address,
      amount: weiAmount,
    });

    if (approveTx) {
      transactions.push(approveTx);
    }

    transactions.push({
      title: t(translations.convertPage.txDialog.convert, {
        asset: sourceToken.toUpperCase(),
      }),
      request: {
        type: TransactionType.signTransaction,
        contract: massetManager,
        fnName: 'mintTo',
        args: [bassetAddress, weiAmount, account],
        gasLimit: GAS_LIMIT.CONVERT,
      },
      onComplete,
    });

    return transactions;
  }, [account, getMassetManager, signer, sourceToken, weiAmount, onComplete]);

  const depositTokens = useCallback(async () => {
    if (!signer || destinationToken !== SupportedTokens.dllr) {
      return;
    }
    const transactions = await getDepositTokenTransactions();

    setTransactions(transactions);
    setTitle(
      t(translations.convertPage.txDialog.convertTitle, {
        from: sourceToken.toUpperCase(),
        to: SupportedTokens.dllr.toUpperCase(),
      }),
    );
    setIsOpen(true);
  }, [
    signer,
    destinationToken,
    getDepositTokenTransactions,
    setTransactions,
    setTitle,
    sourceToken,
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
