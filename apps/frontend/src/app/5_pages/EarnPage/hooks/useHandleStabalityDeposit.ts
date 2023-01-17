import { useCallback } from 'react';

import { ethers } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';
import { getContract } from '@sovryn/contracts';

import { Transaction } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { getRskChainId } from '../../../../utils/chain';
import { toWei } from '../../../../utils/math';
import { useHandleConversion } from '../../ConvertPage/hooks/useHandleConversion';

export const useHandleStabalityDeposit = (
  token: SupportedTokens,
  amount: string,
  isDeposit: boolean,
) => {
  const destinationToken = isDeposit ? SupportedTokens.zusd : token;
  const sourceToken = isDeposit ? SupportedTokens.dllr : token;
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
      title: 'Withdraw ZUSD',
      contract: stabilityPool,
      fnName: 'withdrawFromSP',
      args: [toWei(amount)],
    });

    if (token !== SupportedTokens.zusd) {
      transactions.push(...(await getDepositTokenTransactions()));
    }

    setTransactions(transactions);
    setTitle('Withdraw from stability pool');
    setIsOpen(true);
  }, [
    amount,
    getStabilityPoolContract,
    getDepositTokenTransactions,
    setIsOpen,
    setTitle,
    setTransactions,
    token,
  ]);
  const deposit = useCallback(async () => {
    const transactions: Transaction[] = [];
    if (token !== SupportedTokens.zusd) {
      transactions.push(...(await getWithdrawTokensTransactions()));
    }

    const stabilityPool = await getStabilityPoolContract();

    transactions.push({
      title: 'Deposit ZUSD',
      contract: stabilityPool,
      fnName: 'provideToSP',
      args: [toWei(amount), ethers.constants.AddressZero],
    });

    setTransactions(transactions);
    setTitle('Deposit into stability pool');
    setIsOpen(true);
  }, [
    amount,
    getWithdrawTokensTransactions,
    getStabilityPoolContract,
    setIsOpen,
    setTitle,
    setTransactions,
    token,
  ]);
  const handleSubmit = useCallback(
    () => (isDeposit ? deposit() : withdraw()),
    [deposit, isDeposit, withdraw],
  );

  return handleSubmit;
};
