import { PERMIT2_ADDRESS, PermitTransferFrom } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { BigNumberish, ethers } from 'ethers';
import { t } from 'i18next';

import { getContract } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { isTransactionRequest } from '../../../3_organisms/TransactionStepDialog/helpers';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS, compareAssets } from '../../../../utils/asset';
import {
  getPermitTransferFrom,
  permitHandler,
  prepareApproveTransaction,
  preparePermit2Transaction,
} from '../../../../utils/transactions';

export const useHandleStabilityDeposit = (
  token: string,
  amount: Decimal,
  hasRewardsToClaim: boolean,
  isDeposit: boolean,
  onComplete: () => void,
) => {
  const isDllrToken = compareAssets(token, COMMON_SYMBOLS.DLLR);

  const { signer } = useAccount();
  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const getStabilityPoolContract = useCallback(async () => {
    const { address, abi: massetManagerAbi } = await getContract(
      'stabilityPool',
      'zero',
      RSK_CHAIN_ID,
    );

    return new ethers.Contract(address, massetManagerAbi, signer);
  }, [signer]);

  const withdraw = useCallback(async () => {
    if (!signer) {
      return;
    }
    const stabilityPool = await getStabilityPoolContract();
    let gasLimitToUse: BigNumberish;
    if (isDllrToken) {
      gasLimitToUse = hasRewardsToClaim
        ? GAS_LIMIT.STABILITY_POOL_DLLR_INC_WITHDRAW
        : GAS_LIMIT.STABILITY_POOL_DLLR;
    } else {
      gasLimitToUse = hasRewardsToClaim
        ? GAS_LIMIT.STABILITY_POOL_INC_WITHDRAW
        : GAS_LIMIT.STABILITY_POOL;
    }
    setTransactions([
      {
        title: t(translations.earnPage.txDialog.withdraw, {
          asset: getTokenDisplayName(token),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: stabilityPool,
          fnName: isDllrToken
            ? 'withdrawFromSpAndConvertToDLLR'
            : 'withdrawFromSP',
          args: [amount.toBigNumber().toString()],
          gasLimit: gasLimitToUse,
        },
        onComplete,
      },
    ]);
    setTitle(
      t(translations.earnPage.txDialog.withdrawTitle, {
        asset: getTokenDisplayName(token),
      }),
    );
    setIsOpen(true);
  }, [
    signer,
    getStabilityPoolContract,
    setTransactions,
    isDllrToken,
    amount,
    onComplete,
    setTitle,
    token,
    hasRewardsToClaim,
    setIsOpen,
  ]);

  const deposit = useCallback(async () => {
    if (!signer) {
      return;
    }
    const stabilityPool = await getStabilityPoolContract();
    const weiAmount = amount.toBigNumber().toString();
    const transactions: Transaction[] = [];
    let permitTransferFrom: PermitTransferFrom;

    if (isDllrToken) {
      const approveTx = await prepareApproveTransaction({
        token: COMMON_SYMBOLS.DLLR,
        spender: PERMIT2_ADDRESS,
        amount: weiAmount,
        signer,
        approveMaximumAmount: true,
      });

      if (approveTx) {
        transactions.push(approveTx);
      }

      permitTransferFrom = await getPermitTransferFrom(
        stabilityPool.address,
        weiAmount,
      );

      transactions.push(
        await preparePermit2Transaction(permitTransferFrom, signer),
      );
    }

    transactions.push({
      title: t(translations.earnPage.txDialog.deposit, {
        asset: getTokenDisplayName(token),
      }),
      request: {
        type: TransactionType.signTransaction,
        contract: stabilityPool,
        fnName: isDllrToken ? 'provideToSpFromDllrWithPermit2' : 'provideToSP',
        args: isDllrToken
          ? [weiAmount, '', '']
          : [weiAmount, ethers.constants.AddressZero],
        gasLimit: isDllrToken
          ? GAS_LIMIT.STABILITY_POOL_DLLR
          : GAS_LIMIT.STABILITY_POOL,
      },
      onComplete,
      updateHandler: permitHandler((req, res) => {
        if (isTransactionRequest(req) && isDllrToken) {
          req.args = [weiAmount, permitTransferFrom, res];
        }
        return req;
      }),
    });

    setTransactions(transactions);
    setTitle(
      t(translations.earnPage.txDialog.depositTitle, {
        asset: getTokenDisplayName(token),
      }),
    );
    setIsOpen(true);
  }, [
    signer,
    getStabilityPoolContract,
    amount,
    isDllrToken,
    token,
    onComplete,
    setTransactions,
    setTitle,
    setIsOpen,
  ]);
  const handleSubmit = useCallback(
    () => (isDeposit ? deposit() : withdraw()),
    [deposit, isDeposit, withdraw],
  );

  return handleSubmit;
};
