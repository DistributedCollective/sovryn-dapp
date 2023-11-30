import { useCallback } from 'react';

import { t } from 'i18next';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useGetProtocolContract } from '../../../../../../hooks/useGetContract';
import { translations } from '../../../../../../locales/i18n';

export const useHandleRewards = () => {
  const { account } = useAccount();
  const liquidityMiningProxy = useGetProtocolContract('liquidityMiningProxy');

  const { setTransactions, setIsOpen } = useTransactionContext();

  const onClaimClick = useCallback(() => {
    if (!account || !liquidityMiningProxy) {
      return;
    }
    const transaction: Transaction = {
      title: t(translations.rewardPage.vesting.tx.title),
      request: {
        type: TransactionType.signTransaction,
        contract: liquidityMiningProxy,
        fnName: 'claimRewardFromAllPools',
        args: [account.toLowerCase()],
        gasLimit: GAS_LIMIT.CLAIM_VESTED_SOV_REWARDS,
      },
    };

    setTransactions([transaction]);
    setIsOpen(true);
  }, [account, setIsOpen, setTransactions, liquidityMiningProxy]);

  return onClaimClick;
};
