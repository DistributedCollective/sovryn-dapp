import StabilityPoolABI from '@sovryn-zero/lib-ethers/dist/abi/StabilityPool.json';

import { useCallback, useMemo } from 'react';

import { ethers } from 'ethers';

import { SupportedTokens } from '@sovryn/contracts';

import { Transaction } from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { toWei } from '../../../../utils/math';
import { useHandleConversion } from '../../ConvertPage/hooks/useHandleConversion';

export const useHandleStabalityDeposit = (
  token: SupportedTokens,
  amount: string,
  isDeposit: boolean,
) => {
  const sourceToken = isDeposit ? token : SupportedTokens.dllr;
  const destinationToken = isDeposit ? SupportedTokens.dllr : token;
  const { getDepositTokenTransactions, getWithdrawTokensTransactions } =
    useHandleConversion(sourceToken, destinationToken, amount);
  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  //   const getStabilityPool = useCallback(async () => {
  // const { address: massetManagerAddress, abi: massetManagerAbi } =
  //   await getContract('stabilityPool', 'zero', getRskChainId());

  //     return new ethers.Contract(
  //       addresses.stabilityPool,
  //       StabilityPoolABI,
  //       signer,
  //     );
  //   }, [signer]);

  const contract = useMemo(
    () =>
      new ethers.Contract(
        '0xd6eD2f49D0A3bF20126cB78119c7CB24D02d605F',
        StabilityPoolABI,
        signer,
      ),
    [signer],
  );

  const withdraw = useCallback(async () => {
    const transactions: Transaction[] = [];

    transactions.push({
      title: 'Withdraw ZUSD',
      contract: contract,
      fnName: 'withdrawFromSP',
      args: [toWei(amount)],
    });

    if (token !== SupportedTokens.zusd) {
      transactions.push(...(await getWithdrawTokensTransactions()));
    }

    setTransactions(transactions);
    setTitle('Withdraw from stability pool');
    setIsOpen(true);
  }, [
    amount,
    contract,
    getWithdrawTokensTransactions,
    setIsOpen,
    setTitle,
    setTransactions,
    token,
  ]);
  const deposit = useCallback(async () => {
    const transactions: Transaction[] = [];
    if (token !== SupportedTokens.zusd) {
      transactions.push(...(await getDepositTokenTransactions()));
    }

    transactions.push({
      title: 'Deposit ZUSD',
      contract: contract,
      fnName: 'provideToSP',
      args: [toWei(amount), ethers.constants.AddressZero],
    });

    setTransactions(transactions);
    setTitle('Deposit into stability pool');
    setIsOpen(true);
  }, [
    amount,
    contract,
    getDepositTokenTransactions,
    setIsOpen,
    setTitle,
    setTransactions,
    token,
  ]);
  const handleSubmit = useCallback(() => {
    isDeposit ? deposit() : withdraw();
    // contract.provideToSP(toWei(2), ethers.constants.AddressZero);
  }, [deposit, isDeposit, withdraw]);

  return handleSubmit;
};
