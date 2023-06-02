import { useCallback } from 'react';

import { BigNumber, ethers } from 'ethers';
import { t } from 'i18next';

import {
  SupportedTokens,
  getProtocolContract,
  getTokenDetails,
} from '@sovryn/contracts';
import { PermitTransactionResponse, SwapRoute } from '@sovryn/sdk';

import { defaultChainId } from '../../../../config/chains';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { isSignTransactionDataRequest } from '../../../3_organisms/TransactionStepDialog/helpers';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { translations } from '../../../../locales/i18n';
import {
  permitHandler,
  prepareApproveTransaction,
  preparePermitTransaction,
  UNSIGNED_PERMIT,
} from '../../../../utils/transactions';

export const useHandleConversion = (
  sourceToken: SupportedTokens,
  destinationToken: SupportedTokens,
  weiAmount: BigNumber,
  route: SwapRoute | undefined,
  onComplete: () => void,
) => {
  const { account, signer } = useAccount();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const getMassetManager = useCallback(async () => {
    const { address: massetManagerAddress, abi: massetManagerAbi } =
      await getProtocolContract('massetManager', defaultChainId);

    return new ethers.Contract(massetManagerAddress, massetManagerAbi, signer);
  }, [signer]);

  const getWithdrawTokensTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress } = await getTokenDetails(
      destinationToken,
      defaultChainId,
    );

    return [
      {
        title: t(translations.convertPage.txDialog.convert, {
          asset: sourceToken.toUpperCase(),
        }),
        request: {
          type: TransactionType.signTransaction,
          contract: massetManager,
          fnName: 'redeemTo',
          args: [bassetAddress, weiAmount, account],
          gasLimit: GAS_LIMIT.CONVERT,
        },
        onComplete,
      },
    ] as Transaction[];
  }, [
    account,
    destinationToken,
    getMassetManager,
    sourceToken,
    weiAmount,
    onComplete,
  ]);

  const getDepositTokenTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress, abi: bassetAbi } = await getTokenDetails(
      sourceToken,
      defaultChainId,
    );

    const bassetToken = new ethers.Contract(bassetAddress, bassetAbi, signer);

    const transactions: Transaction[] = [];

    const approveTx = await prepareApproveTransaction({
      token: sourceToken,
      contract: bassetToken,
      spender: massetManager.address,
      amount: weiAmount,
    });

    if (approveTx) {
      transactions.push(approveTx);
    }

    transactions.push({
      title: t(translations.convertPage.txDialog.convert, {
        asset: sourceToken.toUpperCase(),
      }),
      request: {
        type: TransactionType.signTransaction,
        contract: massetManager,
        fnName: 'mintTo',
        args: [bassetAddress, weiAmount, account],
        gasLimit: GAS_LIMIT.CONVERT,
      },
      onComplete,
    });

    return transactions;
  }, [account, getMassetManager, signer, sourceToken, weiAmount, onComplete]);

  const handleSubmit = useCallback(async () => {
    if (!route || !signer) {
      return;
    }

    const [sourceTokenDetails, destinationTokenDetails] = await Promise.all([
      getTokenDetails(sourceToken, defaultChainId),
      getTokenDetails(destinationToken, defaultChainId),
    ]);

    const approveTxData = await route.approve(
      sourceTokenDetails.address,
      destinationTokenDetails.address,
      weiAmount,
      account,
    );

    const transactions: Transaction[] = [];

    if (approveTxData && approveTxData.to && approveTxData.data) {
      transactions.push({
        title: t(translations.convertPage.txDialog.approve, {
          asset: sourceToken.toUpperCase(),
        }),
        request: {
          type: TransactionType.signTransactionData,
          signer: signer,
          to: approveTxData.to,
          data: approveTxData.data,
          gasLimit: GAS_LIMIT.CONVERT,
        },
        onComplete,
      });
    }

    const permitTxData = await route.permit(
      sourceTokenDetails.address,
      destinationTokenDetails.address,
      weiAmount,
      account,
    );

    if (permitTxData) {
      transactions.push(
        await preparePermitTransaction({
          token: sourceTokenDetails.symbol,
          signer,
          spender: permitTxData.spender,
          value: permitTxData.value?.toString(),
          deadline: permitTxData.deadline,
          nonce: permitTxData.nonce,
        }),
      );
    }

    const txData = await route.swap(
      sourceTokenDetails.address,
      destinationTokenDetails.address,
      weiAmount,
      account,
      { permit: permitTxData ? UNSIGNED_PERMIT : undefined },
    );

    if (txData && txData.to && txData.data) {
      transactions.push({
        title: t(translations.convertPage.txDialog.convert, {
          asset: sourceToken.toUpperCase(),
        }),
        request: {
          type: TransactionType.signTransactionData,
          signer: signer,
          to: txData.to,
          data: txData.data,
          gasLimit: GAS_LIMIT.CONVERT,
        },
        onComplete,
        updateHandler: permitHandler(async (req, res) => {
          if (isSignTransactionDataRequest(req) && !!permitTxData) {
            const { data } = await route.swap(
              sourceTokenDetails.address,
              destinationTokenDetails.address,
              weiAmount,
              account,
              {
                permit: res as PermitTransactionResponse,
              },
            );
            req.data = data!;
          }
          return req;
        }),
      });
    }

    setTransactions(transactions);
    setTitle(
      t(translations.convertPage.txDialog.convertTitle, {
        from: sourceToken.toUpperCase(),
        to: destinationToken.toUpperCase(),
      }),
    );
    setIsOpen(true);
  }, [
    account,
    destinationToken,
    onComplete,
    route,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
    sourceToken,
    weiAmount,
  ]);

  return {
    handleSubmit,
    getDepositTokenTransactions,
    getWithdrawTokensTransactions,
  };
};
