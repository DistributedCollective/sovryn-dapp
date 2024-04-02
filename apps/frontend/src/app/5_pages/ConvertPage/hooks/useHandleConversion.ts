import { PERMIT2_ADDRESS, PermitTransferFrom } from '@uniswap/permit2-sdk';

import { useCallback } from 'react';

import { BigNumber, ethers } from 'ethers';
import { t } from 'i18next';

import { getAssetData, getProtocolContract } from '@sovryn/contracts';
import { PermitTransactionResponse, SwapRoute } from '@sovryn/sdk';

import {
  Transaction,
  TransactionType,
} from '../../../3_organisms/TransactionStepDialog/TransactionStepDialog.types';
import { isSignTransactionDataRequest } from '../../../3_organisms/TransactionStepDialog/helpers';
import { GAS_LIMIT } from '../../../../constants/gasLimits';
import { getTokenDisplayName } from '../../../../constants/tokens';
import { useTransactionContext } from '../../../../contexts/TransactionContext';
import { useAccount } from '../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../hooks/useChainStore';
import { translations } from '../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../utils/asset';
import {
  DEFAULT_SIGNATURE,
  EMPTY_PERMIT_TRANSFER_FROM,
  getPermitTransferFrom,
  permitHandler,
  prepareApproveTransaction,
  preparePermit2Transaction,
  preparePermitTransaction,
  UNSIGNED_PERMIT,
} from '../../../../utils/transactions';
import { getRouteContract } from '../ConvertPage.utils';

export const useHandleConversion = (
  sourceToken: string,
  destinationToken: string,
  weiAmount: BigNumber,
  route: SwapRoute | undefined,
  slippageTolerance: string,
  onComplete: () => void,
) => {
  const currentChainId = useCurrentChain();
  const { account, signer } = useAccount();

  const { setTransactions, setIsOpen, setTitle } = useTransactionContext();

  const getMassetManager = useCallback(async () => {
    const { address: massetManagerAddress, abi: massetManagerAbi } =
      await getProtocolContract('massetManager', currentChainId);

    return new ethers.Contract(massetManagerAddress, massetManagerAbi, signer);
  }, [currentChainId, signer]);

  const getWithdrawTokensTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress } = await getAssetData(
      destinationToken,
      currentChainId,
    );

    return [
      {
        title: t(translations.convertPage.txDialog.convert, {
          asset: getTokenDisplayName(sourceToken),
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
    getMassetManager,
    destinationToken,
    currentChainId,
    sourceToken,
    weiAmount,
    account,
    onComplete,
  ]);

  const getDepositTokenTransactions = useCallback(async () => {
    const massetManager = await getMassetManager();

    const { address: bassetAddress, abi: bassetAbi } = await getAssetData(
      sourceToken,
      currentChainId,
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
        asset: getTokenDisplayName(sourceToken),
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
  }, [
    getMassetManager,
    sourceToken,
    currentChainId,
    signer,
    weiAmount,
    account,
    onComplete,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!route || !signer) {
      return;
    }

    const requiresPermit2 =
      !!route && ['ZeroRedemption', 'MocIntegration'].includes(route.name);

    const [sourceTokenDetails, destinationTokenDetails] = await Promise.all([
      getAssetData(sourceToken, currentChainId),
      getAssetData(destinationToken, currentChainId),
    ]);

    const approveTxData = await route.approve(
      sourceTokenDetails.address,
      destinationTokenDetails.address,
      weiAmount,
      account,
    );

    const transactions: Transaction[] = [];

    if (requiresPermit2) {
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
    }

    if (
      !requiresPermit2 &&
      approveTxData &&
      approveTxData.to &&
      approveTxData.data
    ) {
      transactions.push({
        title: t(translations.convertPage.txDialog.approve, {
          asset: getTokenDisplayName(sourceToken),
        }),
        request: {
          type: TransactionType.signTransactionData,
          signer: signer,
          to: approveTxData.to,
          data: approveTxData.data,
          gasLimit: approveTxData.gasLimit ?? GAS_LIMIT.APPROVE,
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

    if (!requiresPermit2 && permitTxData) {
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

    let permitTransferFrom: PermitTransferFrom;

    if (requiresPermit2) {
      const contract = await getRouteContract(route, signer);

      permitTransferFrom = await getPermitTransferFrom(
        contract.address,
        weiAmount.toString(),
      );

      transactions.push(
        await preparePermit2Transaction(permitTransferFrom, signer),
      );
    }

    const txData = await route.swap(
      sourceTokenDetails.address,
      destinationTokenDetails.address,
      weiAmount,
      account,
      {
        permit: permitTxData ? UNSIGNED_PERMIT : undefined,
        permitTransferFrom: requiresPermit2
          ? EMPTY_PERMIT_TRANSFER_FROM
          : undefined,
        signature: DEFAULT_SIGNATURE,
        slippage: Number(slippageTolerance) * 100,
      },
    );

    if (txData && txData.to && txData.data) {
      transactions.push({
        title: t(translations.convertPage.txDialog.convert, {
          asset: getTokenDisplayName(sourceToken),
        }),
        request: {
          type: TransactionType.signTransactionData,
          signer: signer,
          to: txData.to,
          data: txData.data,
          value: txData.value,
          gasLimit: txData?.gasLimit ?? GAS_LIMIT.CONVERT,
          gasPrice: txData?.gasPrice?.toString(),
        },
        onComplete,
        updateHandler: permitHandler(async (req, res) => {
          if (isSignTransactionDataRequest(req)) {
            if (!requiresPermit2 && !!permitTxData) {
              const { data } = await route.swap(
                sourceTokenDetails.address,
                destinationTokenDetails.address,
                weiAmount,
                account,
                {
                  permit: res as PermitTransactionResponse,
                  slippage: Number(slippageTolerance) * 100,
                },
              );
              req.data = data!;
            }

            if (requiresPermit2 && !!permitTransferFrom) {
              const { data } = await route.swap(
                sourceTokenDetails.address,
                destinationTokenDetails.address,
                weiAmount,
                account,
                {
                  permitTransferFrom,
                  signature: typeof res === 'string' ? res : '',
                },
              );
              req.data = data!;
            }
          }
          return req;
        }),
      });
    }

    setTransactions(transactions);
    setTitle(
      t(translations.convertPage.txDialog.convertTitle, {
        from: getTokenDisplayName(sourceToken),
        to: getTokenDisplayName(destinationToken),
      }),
    );
    setIsOpen(true);
  }, [
    account,
    currentChainId,
    destinationToken,
    onComplete,
    route,
    setIsOpen,
    setTitle,
    setTransactions,
    signer,
    slippageTolerance,
    sourceToken,
    weiAmount,
  ]);

  return {
    handleSubmit,
    getDepositTokenTransactions,
    getWithdrawTokensTransactions,
  };
};
