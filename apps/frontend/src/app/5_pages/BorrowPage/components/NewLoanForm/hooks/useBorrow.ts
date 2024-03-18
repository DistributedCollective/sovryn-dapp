import { useCallback } from 'react';

import dayjs from 'dayjs';
import { constants, ethers } from 'ethers';
import { t } from 'i18next';

import { getAssetData, getLoanTokenContract } from '@sovryn/contracts';

import { RSK_CHAIN_ID } from '../../../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { GAS_LIMIT } from '../../../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../../../contexts/TransactionContext';
import { useAccount } from '../../../../../../hooks/useAccount';
import { translations } from '../../../../../../locales/i18n';
import {
  COMMON_SYMBOLS,
  maybeWrappedAsset,
} from '../../../../../../utils/asset';
import { toWei } from '../../../../../../utils/math';
import { prepareApproveTransaction } from '../../../../../../utils/transactions';

const currentDate = dayjs().unix();

export const useBorrow = () => {
  const { account, signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const handleSubmit = useCallback(
    async (
      borrowToken: string,
      borrowAmount: string,
      firstRolloverDate: number,
      collateralAmount: string,
      collateralToken: string,
      loanId?: string,
    ) => {
      if (!signer) {
        return;
      }

      const loanDuration = Math.ceil(firstRolloverDate - currentDate);

      const isCollateralRbtc =
        collateralToken === COMMON_SYMBOLS.WBTC ||
        collateralToken === COMMON_SYMBOLS.BTC;

      const { abi: borrowTokenAbi, address: borrowTokenAddress } =
        await getLoanTokenContract(
          maybeWrappedAsset(borrowToken),
          RSK_CHAIN_ID,
        );

      const borrowTokenContract = new ethers.Contract(
        borrowTokenAddress,
        borrowTokenAbi,
        signer,
      );

      const { address: collateralTokenAddress } = await getAssetData(
        maybeWrappedAsset(collateralToken),
        RSK_CHAIN_ID,
      );

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

      const transactionTitle =
        loanId && loanId !== ''
          ? t(
              translations.fixedInterestPage.adjustLoanDialog.dialogTitles
                .adjust,
            )
          : t(translations.fixedInterestPage.newLoanDialog.transaction.title);

      transactions.push({
        title: transactionTitle,
        request: {
          type: TransactionType.signTransaction,
          contract: borrowTokenContract,
          fnName: 'borrow',
          args: [
            loanId && loanId !== '' ? loanId : constants.HashZero,
            toWei(borrowAmount),
            loanDuration,
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

      setTitle(transactionTitle);
      setTransactions(transactions);
      setIsOpen(true);
    },
    [account, setIsOpen, setTitle, setTransactions, signer],
  );

  return handleSubmit;
};
