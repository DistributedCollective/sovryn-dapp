import { useCallback } from 'react';

import { ethers } from 'ethers';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { getContract } from '@sovryn/contracts';

import { Transaction } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { getRskChainId } from '../../../../utils/chain';
import { GAS_LIMIT_STABILITY_POOL } from '../../../../utils/constants';
import { toWei } from '../../../../utils/math';
import { useHandleConversion } from '../../ConvertPage/hooks/useHandleConversion';

export const useHandleStabilityDeposit = (
  token: SupportedTokens,
  amount: string,
  isDeposit: boolean,
  onComplete: () => void,
) => {
  const sourceToken = isDeposit ? token : SupportedTokens.zusd;
  const destinationToken = isDeposit ? SupportedTokens.zusd : token;

  const { getDepositTokenTransactions, getWithdrawTokensTransactions } =
    useHandleConversion(sourceToken, destinationToken, amount);
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const getStabilityPoolContract = useCallback(async () => {
    const { address, abi: massetManagerAbi } = await getContract(
      'stabilityPool',
      'zero',
      getRskChainId(),
    );

    return new ethers.Contract(address, massetManagerAbi, signer);
  }, [signer]);

  const withdraw = useCallback(async () => {
    const transactions: Transaction[] = [];
    const stabilityPool = await getStabilityPoolContract();

    transactions.push({
      title: t(translations.earnPage.txDialog.withdraw, {
        asset: token.toUpperCase(),
      }),
      contract: stabilityPool,
      fnName: 'withdrawFromSP',
      args: [toWei(amount)],
      onComplete,
      config: {
        gasLimit: GAS_LIMIT_STABILITY_POOL,
      },
    });

    if (token !== SupportedTokens.zusd) {
      transactions.push(...(await getDepositTokenTransactions()));
    }

    setTransactions(transactions);
    setTitle(
      t(translations.earnPage.txDialog.withdrawTitle, {
        asset: token.toUpperCase(),
      }),
    );
    setIsOpen(true);
  }, [
    amount,
    getStabilityPoolContract,
    getDepositTokenTransactions,
    setIsOpen,
    setTitle,
    setTransactions,
    token,
    onComplete,
  ]);

  const deposit = useCallback(async () => {
    const transactions: Transaction[] = [];
    if (token !== SupportedTokens.zusd) {
      transactions.push(...(await getWithdrawTokensTransactions()));
    }

    const stabilityPool = await getStabilityPoolContract();

    transactions.push({
      title: t(translations.earnPage.txDialog.deposit, {
        asset: token.toUpperCase(),
      }),
      contract: stabilityPool,
      fnName: 'provideToSP',
      args: [toWei(amount), ethers.constants.AddressZero],
      onComplete,
      config: {
        gasLimit: GAS_LIMIT_STABILITY_POOL,
      },
    });

    setTransactions(transactions);
    setTitle(
      t(translations.earnPage.txDialog.depositTitle, {
        asset: token.toUpperCase(),
      }),
    );
    setIsOpen(true);
  }, [
    amount,
    getWithdrawTokensTransactions,
    getStabilityPoolContract,
    setIsOpen,
    setTitle,
    setTransactions,
    token,
    onComplete,
  ]);
  const handleSubmit = useCallback(
    () => (isDeposit ? deposit() : withdraw()),
    [deposit, isDeposit, withdraw],
  );

  return handleSubmit;
};
