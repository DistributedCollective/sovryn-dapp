import { useCallback } from 'react';

import { constants } from 'ethers';
import { t } from 'i18next';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { useGetProtocolContract } from '../../../../hooks/useGetContract';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import { toWei } from '../../../../utils/math';
import { prepareApproveTransaction } from '../../../../utils/transactions';

export const useHandleStake = (
  amount: string,
  timestamp: number,
  onComplete: () => void,
) => {
  const { signer, account } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const chainId = useCurrentChain();

  const stakingContract = useGetProtocolContract('staking', chainId);

  const stake = useCallback(async () => {
    if (!signer || !stakingContract) {
      return;
    }

    const weiAmount = toWei(amount).toString();
    const transactions: Transaction[] = [];

    const approveTx = await prepareApproveTransaction({
      token: COMMON_SYMBOLS.SOV,
      spender: stakingContract.address,
      amount: weiAmount,
      signer,
      chain: chainId,
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
    chainId,
    timestamp,
    account,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
  ]);

  const handleSubmit = useCallback(() => stake(), [stake]);

  return handleSubmit;
};
