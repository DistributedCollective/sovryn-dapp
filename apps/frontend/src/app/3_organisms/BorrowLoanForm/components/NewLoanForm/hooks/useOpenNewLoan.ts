import { useCallback } from 'react';

import { constants, ethers } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  getLendTokenContract,
  getTokenContract,
} from '@sovryn/contracts';

import { defaultChainId } from '../../../../../../config/chains';

import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import { toWei } from '../../../../../../utils/math';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';
import {
  Transaction,
  TransactionType,
} from '../../../../TransactionStepDialog/TransactionStepDialog.types';
import { SECONDS_IN_DAY } from '../NewLoanForm.constants';

export const useOpenNewLoan = () => {
  const { account, signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const handleSubmit = useCallback(
    async (
      borrowToken: SupportedTokens,
      borrowAmount: string,
      loanDuration: number,
      collateralAmount: string,
      collateralToken: SupportedTokens,
    ) => {
      if (!signer) {
        return;
      }

      const isCollateralRbtc = collateralToken === SupportedTokens.rbtc;

      const { abi: borrowTokenAbi, address: borrowTokenAddress } =
        await getLendTokenContract(borrowToken, defaultChainId);

      const borrowTokenContract = new ethers.Contract(
        borrowTokenAddress,
        borrowTokenAbi,
        signer,
      );

      const { address: collateralTokenAddress } = await getTokenContract(
        isCollateralRbtc ? SupportedTokens.wrbtc : collateralToken,
        defaultChainId,
      );

      const initialLoanDuration = SECONDS_IN_DAY * 28; // TODO: This is just hardcoded for now, will be dynamic in the future

      const transactions: Transaction[] = [];

      if (!isCollateralRbtc) {
        const approve = await prepareApproveTransaction({
          token: collateralToken,
          amount: toWei(collateralAmount),
          signer,
          spender: borrowTokenAddress,
        });
        if (approve) {
          transactions.push(approve);
        }
      }

      transactions.push({
        title: t(
          translations.fixedInterestPage.newLoanDialog.transaction.title,
        ),
        request: {
          type: TransactionType.signTransaction,
          contract: borrowTokenContract,
          fnName: 'borrow',
          args: [
            constants.HashZero,
            toWei(borrowAmount),
            initialLoanDuration,
            toWei(collateralAmount),
            collateralTokenAddress,
            account,
            account,
            '0x',
          ],
          value: isCollateralRbtc ? toWei(collateralAmount) : '0',
          gasLimit: GAS_LIMIT.BORROW,
        },
      });

      setTitle(
        t(translations.fixedInterestPage.newLoanDialog.transaction.title),
      );
      setTransactions(transactions);
      setIsOpen(true);
    },
    [account, setIsOpen, setTitle, setTransactions, signer],
  );

  return handleSubmit;
};
