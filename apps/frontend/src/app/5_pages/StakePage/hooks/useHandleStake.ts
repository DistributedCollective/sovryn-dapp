import { useCallback } from 'react';

import { constants } from 'ethers';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { toWei } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';

export const useHandleStake = (
  amount: string,
  timestamp: number,
  onComplete: () => void,
) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const stakingContract = useGetProtocolContract('staking');

  const stake = useCallback(async () => {
    if (!signer || !stakingContract) {
      return;
    }

    const weiAmount = toWei(amount).toString();
    const transactions: Transaction[] = [];

    const approveTx = await prepareApproveTransaction({
      token: SupportedTokens.sov,
      spender: stakingContract.address,
      amount: weiAmount,
      signer,
    });

    if (approveTx) {
      transactions.push(approveTx);
    }

    transactions.push({
      title: t(translations.stakePage.txDialog.addNewStake),
      request: {
        type: TransactionType.signTransaction,
        contract: stakingContract,
        fnName: 'stake',
        args: [weiAmount, timestamp, account, constants.AddressZero],
        gasLimit: GAS_LIMIT.STAKING_STAKE,
      },
      onComplete,
    });

    setTransactions(transactions);

    setTitle(t(translations.stakePage.txDialog.addNewStakeTitle));
    setIsOpen(true);
  }, [
    signer,
    stakingContract,
    amount,
    timestamp,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
    account,
  ]);

  const handleSubmit = useCallback(() => stake(), [stake]);

  return handleSubmit;
};
