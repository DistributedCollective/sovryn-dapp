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

export const useDepositCollateral = () => {
  const contract = useLoadContract('protocol', 'protocol', RSK_CHAIN_ID);
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();
  const { account, signer } = useAccount();

  const handleSubmit = useCallback(
    async (depositAmount: string, depositToken: string, loanId: string) => {
      if (!contract || !account || !signer) {
        return;
      }

      const weiDepositAmount = toWei(depositAmount);
      const isDepositTokenRbtc = depositToken === COMMON_SYMBOLS.BTC;

      const transactions: Transaction[] = [];

      if (!isDepositTokenRbtc) {
        const approve = await prepareApproveTransaction({
          token: depositToken,
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
          translations.fixedInterestPage.adjustLoanDialog.dialogTitles
            .addCollateral,
        ),
        request: {
          type: TransactionType.signTransaction,
          contract,
          fnName: 'depositCollateral',
          args: [loanId, weiDepositAmount],
          value: isDepositTokenRbtc ? weiDepositAmount : '0',
          gasLimit: GAS_LIMIT.REPAY_LOAN,
        },
      });

      setTransactions(transactions);
      setTitle(
        t(
          translations.fixedInterestPage.adjustLoanDialog.dialogTitles
            .addCollateral,
        ),
      );
      setIsOpen(true);
    },

    [account, contract, setIsOpen, setTitle, setTransactions, signer],
  );

  return handleSubmit;
};
