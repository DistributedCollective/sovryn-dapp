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
import { COMMON_SYMBOLS } from '../../../../../../utils/asset';
import { toWei } from '../../../../../../utils/math';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';

export const useRepayLoan = () => {
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { account, signer } = useAccount();

  const handleSubmit = useCallback(
    async (
      repayAmount: string,
      loanId: string,
      borrowToken: string,
      isPartialRepay?: boolean,
    ) => {
      if (!contract || !account || !signer) {
        return;
      }

      const weiRepayAmount = toWei(repayAmount);

      const isBorrowTokenRbtc = borrowToken === COMMON_SYMBOLS.BTC;

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
          translations.fixedInterestPage.adjustLoanDialog.dialogTitles[
            isPartialRepay ? 'repay' : 'close'
          ],
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
        t(
          translations.fixedInterestPage.adjustLoanDialog.dialogTitles[
            isPartialRepay ? 'repay' : 'close'
          ],
        ),
      );
      setTransactions(transactions);
      setIsOpen(true);
    },
    [account, contract, setIsOpen, setTitle, setTransactions, signer],
  );

  return handleSubmit;
};
