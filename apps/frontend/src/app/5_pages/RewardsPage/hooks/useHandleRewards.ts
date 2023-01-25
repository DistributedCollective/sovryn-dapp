import { useCallback, useMemo } from 'react';

import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';

import { getContract } from '@sovryn/contracts';

import { Transaction } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import { toWei } from '../../../../utils/math';
import { RewardsAction } from './../types';

export const useHandleRewards = (action: RewardsAction, amount: string) => {
  const { t } = useTranslation();
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const title = useMemo(
    () =>
      action === RewardsAction.withdrawFromSP
        ? t(translations.rewardPage.tx.withdrawGains)
        : t(translations.rewardPage.tx.transferToLOC),
    [action, t],
  );

  const transactionTitle = useMemo(
    () =>
      action === RewardsAction.withdrawFromSP
        ? t(translations.rewardPage.tx.withdraw)
        : t(translations.rewardPage.tx.transfer),
    [action, t],
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
      contract: stabilityPool,
      fnName: action,
      args:
        action === RewardsAction.withdrawFromSP
          ? [toWei(amount)]
          : [account, account],
    });

    setTransactions(transactions);
    setTitle(transactionTitle);
    setIsOpen(true);
  }, [
    amount,
    account,
    action,
    title,
    transactionTitle,
    getStabilityPoolContract,
    setIsOpen,
    setTitle,
    setTransactions,
  ]);

  return handleAction;
};
