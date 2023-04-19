import { useCallback, useMemo } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { getContract } from '@sovryn/contracts';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import { toWei } from '../../../../utils/math';
import { RewardsAction } from './../types';

export const useHandleRewards = (
  action: RewardsAction,
  amount: string,
  onComplete?: () => void,
) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const isWithdrawTransaction = useMemo(
    () => action === RewardsAction.withdrawFromSP,
    [action],
  );

  const title = useMemo(
    () =>
      isWithdrawTransaction
        ? t(translations.rewardPage.tx.withdrawGains)
        : t(translations.rewardPage.tx.transferToLOC),
    [isWithdrawTransaction],
  );

  const transactionTitle = useMemo(
    () =>
      isWithdrawTransaction
        ? t(translations.rewardPage.tx.withdraw)
        : t(translations.rewardPage.tx.transfer),
    [isWithdrawTransaction],
  );

  const getStabilityPoolContract = useCallback(async () => {
    const { address, abi: massetManagerAbi } = await getContract(
      'stabilityPool',
      'zero',
      getRskChainId(),
    );

    return new ethers.Contract(address, massetManagerAbi, signer);
  }, [signer]);

  const handleAction = useCallback(async () => {
    const transactions: Transaction[] = [];
    const stabilityPool = await getStabilityPoolContract();

    transactions.push({
      title: title,
      request: {
        type: TransactionType.signTransaction,
        contract: stabilityPool,
        fnName: action,
        args: isWithdrawTransaction ? [toWei(amount)] : [account, account],
        gasLimit: isWithdrawTransaction
          ? GAS_LIMIT.REWARDS
          : GAS_LIMIT.TRANSFER_LOC,
      },
      onComplete,
    });

    setTransactions(transactions);
    setTitle(transactionTitle);
    setIsOpen(true);
  }, [
    getStabilityPoolContract,
    title,
    action,
    isWithdrawTransaction,
    amount,
    account,
    setTransactions,
    setTitle,
    transactionTitle,
    setIsOpen,
    onComplete,
  ]);

  return handleAction;
};
