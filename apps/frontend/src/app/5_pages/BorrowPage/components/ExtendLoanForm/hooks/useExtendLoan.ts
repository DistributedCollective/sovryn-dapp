import { useCallback, useMemo } from 'react';

import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { LoanItem } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoansTable.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { useLoadContract } from '../../../../../../hooks/useLoadContract';
import { translations } from '../../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../../utils/asset';
import { toWei } from '../../../../../../utils/math';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';

export const useExtendLoan = (
  loan: LoanItem,
  debtToken: string,
  nextRollover: string | number,
  useCollateral: boolean,
) => {
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);
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

    const weiDepositAmount = toWei(depositAmount);
    if (!useCollateral && debtToken !== COMMON_SYMBOLS.BTC) {
      const approve = await prepareApproveTransaction({
        token: debtToken,
        amount: weiDepositAmount,
        signer,
        spender: contract.address,
      });
      if (approve) {
        transactions.push(approve);
      }
    }

    transactions.push({
      title: t(
        translations.fixedInterestPage.extendLoanDialog.dialogTitles.extend,
      ),
      request: {
        type: TransactionType.signTransaction,
        contract,
        fnName: 'extendLoanDuration',
        args: [loan.id, weiDepositAmount, useCollateral, '0x'],
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
    debtToken,
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
