import { useMemo, useCallback } from 'react';

import { Contract } from 'ethers';
import { t } from 'i18next';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { VestingContractType } from '../../../../../../utils/graphql/rsk/generated';
import VestingAbi from '../Vesting.json';
import { VestingContractTableRecord } from '../Vesting.types';

export const useHandleWithdraw = (item: VestingContractTableRecord) => {
  const { signer, account } = useAccount();

  const vestingContract = useMemo(
    () => new Contract(item.address.toLowerCase(), VestingAbi, signer),
    [item.address, signer],
  );

  const gasLimit = useMemo(
    () =>
      item.type === VestingContractType.Team
        ? GAS_LIMIT.SOV_WITHDRAW_VESTING_TEAM
        : GAS_LIMIT.SOV_WITHDRAW_VESTING,
    [item.type],
  );

  const { setTransactions, setIsOpen } = useTransactionContext();

  const onWithdrawClick = useCallback(() => {
    const transaction: Transaction = {
      title: t(translations.rewardPage.vesting.tx.title),
      request: {
        type: TransactionType.signTransaction,
        contract: vestingContract,
        fnName: 'withdrawTokens',
        args: [account.toLowerCase()],
        gasLimit,
      },
    };

    setTransactions([transaction]);
    setIsOpen(true);
  }, [account, gasLimit, setIsOpen, setTransactions, vestingContract]);

  return onWithdrawClick;
};
