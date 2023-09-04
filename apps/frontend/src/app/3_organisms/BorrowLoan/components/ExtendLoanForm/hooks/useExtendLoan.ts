import { useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { defaultChainId } from '../../../../../../config/chains';

import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { translations } from '../../../../../../locales/i18n';
import { toWei } from '../../../../../../utils/math';
import {
  Transaction,
  TransactionType,
} from '../../../../TransactionStepDialog/TransactionStepDialog.types';

export const useExtendLoan = (
  loan: LoanItem,
  nextRollover: string | number,
  useCollateral: boolean,
) => {
  const contract = useLoadContract('protocol', 'protocol', defaultChainId);
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { account, signer } = useAccount();

  const depositAmount = useMemo(() => {
    if (!nextRollover) {
      return '0';
    }

    return Decimal.from(loan.interestOwedPerDay)
      .mul(Number(nextRollover) - loan.rolloverDate)
      .div(24 * 60 * 60)
      .toString();
  }, [loan.interestOwedPerDay, loan.rolloverDate, nextRollover]);

  const handleSubmit = useCallback(async () => {
    if (!contract || !account || !signer) {
      return;
    }

    const transactions: Transaction[] = [];

    transactions.push({
      title: t(
        translations.fixedInterestPage.adjustLoanDialog.dialogTitles.close,
      ),
      request: {
        type: TransactionType.signTransaction,
        contract,
        fnName: 'extendLoanDuration',
        args: [loan.id, toWei(depositAmount), useCollateral],
        gasLimit: GAS_LIMIT.REPAY_LOAN,
      },
    });

    setTransactions(transactions);
    setTitle(
      t(translations.fixedInterestPage.extendLoanDialog.dialogTitles.extend),
    );
    setTransactions(transactions);
    setIsOpen(true);
  }, [
    account,
    contract,
    depositAmount,
    loan.id,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
    useCollateral,
  ]);

  return { handleSubmit, depositAmount };
};
