import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames';
import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { t } from 'i18next';

import {
  Button,
  ErrorBadge,
  ErrorLevel,
  Icon,
  IconNames,
  StatusType,
} from '@sovryn/ui';

import { APPROVAL_FUNCTION } from '../../../../../constants/general';
import { useAccount } from '../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useNativeAssetBalance } from '../../../../../hooks/useNativeAssetBalance';
import { translations } from '../../../../../locales/i18n';
import { findNativeAsset } from '../../../../../utils/asset';
import { sleep } from '../../../../../utils/helpers';
import { fromWei, toWei } from '../../../../../utils/math';
import { signERC2612Permit } from '../../../../../utils/permit/permit';
import {
  Transaction,
  TransactionReceiptStatus,
  TransactionStepData,
  TransactionConfig,
  TransactionReceipt,
} from '../../TransactionStepDialog.types';
import {
  isMessageSignatureRequest,
  isPermitRequest,
  isSignTransactionDataRequest,
  isTransactionRequest,
  isTypedDataRequest,
} from '../../helpers';
import { sendOrSimulateTx } from '../../utils';
import { TransactionStep } from '../TransactionStep/TransactionStep';

export type TransactionStepsProps = {
  transactions: Transaction[];
  onSuccess?: () => void;
  onClose?: () => void;
  gasPrice: string;
  onTxStatusChange?: (status: StatusType) => void;
};

export const TransactionSteps: FC<TransactionStepsProps> = ({
  transactions,
  onSuccess,
  onClose,
  gasPrice,
  onTxStatusChange,
}) => {
  const chainId = useCurrentChain();
  const [stepData, setStepData] = useState<TransactionStepData[]>([]);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState(false);
  const [estimatedGasFee, setEstimatedGasFee] = useState(0);
  const { balance: nativeBalance, loading } = useNativeAssetBalance(chainId);
  const { account } = useAccount();

  const hasEnoughBalance = useMemo(
    () => account && !loading && nativeBalance.sub(estimatedGasFee).gt(0),
    [account, loading, nativeBalance, estimatedGasFee],
  );

  const nativeAsset = useMemo(() => findNativeAsset(chainId), [chainId]);

  useEffect(() => {
    const initialize = async () => {
      const steps: TransactionStepData[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const { request } = transactions[i];

        const item: TransactionStepData = {
          transaction: transactions[i],
          receipt: {
            status: TransactionReceiptStatus.pending,
            request,
          },
          config: {},
        };

        if (isTransactionRequest(request)) {
          const {
            contract,
            fnName,
            args: requestArgs,
            gasLimit,
            value,
          } = request;
          const args = [...requestArgs];
          if (fnName === APPROVAL_FUNCTION) {
            args[1] = ethers.constants.MaxUint256;
          }

          item.config.gasLimit =
            gasLimit ??
            (await contract.estimateGas[fnName](
              ...[...args, { value: value ?? 0 }],
            )
              .then(gas => gas.toString())
              .catch(() => BigNumber.from(6_000_000).toString()));

          item.config.gasLimit &&
            setEstimatedGasFee(
              Number(
                fromWei(
                  toWei(gasPrice)
                    .mul(item.config.gasLimit)
                    .div(10 ** 9),
                ),
              ),
            );
          item.config.amount =
            fnName === APPROVAL_FUNCTION ? requestArgs[1] : undefined;
          item.config.unlimitedAmount =
            fnName === APPROVAL_FUNCTION ? false : undefined;
          item.config.gasPrice = request.gasPrice ?? gasPrice;
        } else if (isSignTransactionDataRequest(request)) {
          const { signer, data, to, gasLimit, value } = request;

          item.config.gasLimit =
            gasLimit ??
            (
              await signer
                .estimateGas({
                  to,
                  data,
                  value: value ?? 0,
                })
                .catch(() => BigNumber.from(6_000_000))
            ).toString();

          item.config.gasPrice = request.gasPrice ?? gasPrice;
        }

        steps.push(item);
      }

      setStepData(steps);
    };

    if (gasPrice) {
      initialize();
    }
  }, [gasPrice, transactions]);

  const updateConfig = useCallback(
    (index: number, config: TransactionConfig) => {
      setStepData(items => {
        if (items[index]) {
          const updatedItems = [...items];
          updatedItems[index] = { ...updatedItems[index], config };

          if (config.gasLimit && config.gasPrice) {
            const gasFee = fromWei(
              toWei(config.gasPrice)
                .mul(config.gasLimit)
                .div(10 ** 9),
            );
            setEstimatedGasFee(Number(gasFee));
          }

          return updatedItems;
        }

        return items;
      });
    },
    [setStepData],
  );

  const updateReceipt = useCallback(
    (index: number, receipt: TransactionReceipt) => {
      setStepData(items => {
        if (items[index]) {
          const copy = [...items];
          copy[index].receipt = receipt;
          return copy;
        }
        return items;
      });
    },
    [setStepData],
  );

  const handleUpdates = useCallback(async () => {
    const items = [...stepData];

    await Promise.all(
      items.map(async (item, i) => {
        if (item.transaction.updateHandler) {
          item.transaction.request = await item.transaction.updateHandler(
            item.transaction.request,
            items.map(i => i.receipt),
          );
        }
        return item;
      }),
    );

    setStepData(items);
  }, [stepData]);

  const submit = useCallback(async () => {
    try {
      let i = 0;
      if (error) {
        setError(false);
        i = step;
      }
      for (; i < transactions.length; i++) {
        setStep(i);
        const config = stepData[i].config;
        const { request } = transactions[i];
        if (isTransactionRequest(request)) {
          const args = [...request.args];
          if (request.fnName === APPROVAL_FUNCTION) {
            args[1] = config.unlimitedAmount
              ? ethers.constants.MaxUint256
              : config.amount;
          }
          const tx = await sendOrSimulateTx(request, args, config);

          updateReceipt(i, {
            status: TransactionReceiptStatus.pending,
            request,
            response: tx.hash,
          });

          transactions[i].onStart?.(tx.hash);
          transactions[i].onChangeStatus?.(StatusType.pending);

          await tx.wait();

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(tx.hash);

          updateReceipt(i, {
            status: TransactionReceiptStatus.success,
            request,
            response: tx.hash,
          });

          onTxStatusChange?.(StatusType.success);

          await handleUpdates();
        } else if (isMessageSignatureRequest(request)) {
          const signature = await request.signer.signMessage(request.message);

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(signature);

          updateReceipt(i, {
            status: TransactionReceiptStatus.success,
            request,
            response: signature,
          });

          await handleUpdates();
        } else if (isTypedDataRequest(request)) {
          const signature = await request.signer._signTypedData(
            request.domain,
            request.types,
            request.values,
          );

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(signature);

          updateReceipt(i, {
            status: TransactionReceiptStatus.success,
            request,
            response: signature,
          });

          await handleUpdates();
        } else if (isPermitRequest(request)) {
          const response = await signERC2612Permit(
            request.signer,
            request.token,
            request.owner,
            request.spender,
            request.value,
            request.deadline,
            request.nonce,
          );

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(response);

          updateReceipt(i, {
            status: TransactionReceiptStatus.success,
            request,
            response,
          });

          await handleUpdates();
        } else if (isSignTransactionDataRequest(request)) {
          const gasLimit = config.gasLimit
            ? config.gasLimit?.toString()
            : undefined;
          const gasPrice = config.gasPrice
            ? parseUnits(config.gasPrice?.toString() || '0', 9)
            : undefined;

          const from = await request.signer.getAddress();
          const nonce = await request.signer.getTransactionCount();

          const tx = await request.signer.sendTransaction({
            data: request.data,
            to: request.to,
            value: request.value,
            gasLimit,
            gasPrice,
            from,
            nonce,
          });

          updateReceipt(i, {
            status: TransactionReceiptStatus.pending,
            request,
            response: tx.hash,
          });

          transactions[i].onStart?.(tx.hash);
          transactions[i].onChangeStatus?.(StatusType.pending);

          await tx.wait();

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(tx.hash);

          updateReceipt(i, {
            status: TransactionReceiptStatus.success,
            request,
            response: tx.hash,
          });

          onTxStatusChange?.(StatusType.success);

          await handleUpdates();
        } else {
          // unknown type
          transactions[i].onChangeStatus?.(StatusType.error);
        }

        if (i < transactions.length - 1) {
          // allow wallet to update before next transaction
          await sleep(500);
        }
      }

      setStep(transactions.length);
    } catch (error) {
      onTxStatusChange?.(StatusType.error);
      console.error('error:', error);

      transactions[0].onChangeStatus?.(StatusType.error);

      handleUpdates();

      setError(true);
    }
  }, [
    error,
    transactions,
    step,
    stepData,
    updateReceipt,
    handleUpdates,
    onTxStatusChange,
  ]);

  const getStatus = useCallback(
    (i: number) => {
      if (i < step) {
        return StatusType.success;
      }
      if (i === step) {
        if (error) {
          return StatusType.error;
        }
        return StatusType.pending;
      }
      return StatusType.idle;
    },
    [error, step],
  );

  const isLoading = useMemo(
    () => step > -1 && step < transactions.length && !error && !loading,
    [error, step, transactions.length, loading],
  );

  useEffect(() => {
    if (transactions.length > 0 && transactions.length === step) {
      onSuccess?.();
    }
  }, [onSuccess, step, transactions.length]);

  const getConfig = useCallback((i: number) => stepData[i].config, [stepData]);
  const getReceipt = useCallback(
    (i: number) => stepData[i].receipt,
    [stepData],
  );

  if (!stepData.length) {
    return (
      <Icon
        size={30}
        className="animate-spin mx-auto my-4"
        icon={IconNames.PENDING}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {transactions.map((tx, i) => (
        <TransactionStep
          key={i}
          transaction={tx}
          step={i + 1}
          status={getStatus(i)}
          isLoading={isLoading}
          config={getConfig(i)}
          receipt={getReceipt(i)}
          updateConfig={(config: TransactionConfig) => updateConfig(i, config)}
          gasPrice={gasPrice}
        />
      ))}
      {!isLoading && transactions.length > step && (
        <>
          <Button
            className={classNames('w-full', hasEnoughBalance && 'mt-7')}
            text={t(translations.common.buttons[error ? 'retry' : 'confirm'])}
            onClick={submit}
            dataAttribute={`tx-dialog-${error ? 'retry' : 'confirm'}`}
            disabled={!hasEnoughBalance}
          />

          {!hasEnoughBalance && (
            <ErrorBadge
              level={ErrorLevel.Critical}
              message={t(translations.transactionStep.notEnoughBalance, {
                asset: nativeAsset.symbol,
              })}
            />
          )}
        </>
      )}
      {onClose && transactions.length === step && (
        <Button
          text={t(translations.common.buttons.done)}
          onClick={onClose}
          className="w-full mt-7"
          dataAttribute="tx-dialog-done"
        ></Button>
      )}
    </div>
  );
};
