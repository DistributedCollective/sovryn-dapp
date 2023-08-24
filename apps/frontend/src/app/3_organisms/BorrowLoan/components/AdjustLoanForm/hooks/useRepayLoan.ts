import { useCallback } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';

import { defaultChainId } from '../../../../../../config/chains';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { translations } from '../../../../../../locales/i18n';
import { toWei } from '../../../../../../utils/math';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';
import {
  Transaction,
  TransactionType,
} from '../../../../TransactionStepDialog/TransactionStepDialog.types';

export const useRepayLoan = () => {
  const contract = useLoadContract('protocol', 'protocol', defaultChainId);
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { account, signer } = useAccount();

  const handleSubmit = useCallback(
    async (
      repayAmount: string,
      loanId: string,
      borrowToken: SupportedTokens,
    ) => {
      if (!contract || !account || !signer) {
        return;
      }

      const weiRepayAmount = toWei(repayAmount);

      const isBorrowTokenRbtc = borrowToken === SupportedTokens.rbtc;

      const transactions: Transaction[] = [];

      if (!isBorrowTokenRbtc) {
        const approve = await prepareApproveTransaction({
          token: borrowToken,
          amount: weiRepayAmount,
          signer,
          spender: contract.address,
        });
        if (approve) {
          transactions.push(approve);
        }
      }

      transactions.push({
        title: t(
          translations.fixedInterestPage.adjustLoanDialog.dialogTitles.close,
        ),
        request: {
          type: TransactionType.signTransaction,
          contract,
          fnName: 'closeWithDeposit',
          args: [loanId, account, weiRepayAmount],
          value: isBorrowTokenRbtc ? weiRepayAmount : '0',
          gasLimit: GAS_LIMIT.REPAY_LOAN,
        },
      });

      setTransactions(transactions);
      setTitle(
        t(translations.fixedInterestPage.adjustLoanDialog.dialogTitles.close),
      );
      setTransactions(transactions);
      setIsOpen(true);
    },
    [account, contract, setIsOpen, setTitle, setTransactions, signer],
  );

  return handleSubmit;
};
