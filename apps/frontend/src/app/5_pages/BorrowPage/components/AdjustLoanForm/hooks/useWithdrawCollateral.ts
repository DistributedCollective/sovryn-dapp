import { useCallback } from 'react';

import { t } from 'i18next';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { translations } from '../../../../../../locales/i18n';
import { toWei } from '../../../../../../utils/math';

export const useWithdrawCollateral = () => {
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { account, signer } = useAccount();

  const handleSubmit = useCallback(
    async (amount: string, loanId: string) => {
      if (!contract || !account || !signer) {
        return;
      }

      const weiAmount = toWei(amount);

      const transactions: Transaction[] = [
        {
          title: t(
            translations.fixedInterestPage.adjustLoanDialog.dialogTitles
              .withdrawCollateral,
          ),
          request: {
            type: TransactionType.signTransaction,
            contract,
            fnName: 'withdrawCollateral',
            args: [loanId, account, weiAmount],
            gasLimit: GAS_LIMIT.WITHDRAW_LOAN_COLLATERAL,
          },
        },
      ];

      setTransactions(transactions);
      setTitle(
        t(
          translations.fixedInterestPage.adjustLoanDialog.dialogTitles
            .withdrawCollateral,
        ),
      );
      setIsOpen(true);
    },
    [account, contract, setIsOpen, setTitle, setTransactions, signer],
  );

  return handleSubmit;
};
