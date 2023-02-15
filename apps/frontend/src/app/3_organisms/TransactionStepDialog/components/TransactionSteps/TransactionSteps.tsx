import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';

import { Button, Icon, IconNames, StatusType } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { APPROVAL_FUNCTION } from '../../../../../utils/constants';
import { sleep } from '../../../../../utils/helpers';
import {
  Transaction,
  TransactionReceiptStatus,
  TxConf,
  TxConfig,
  TxType,
} from '../../TransactionStepDialog.types';
import { TransactionStep } from '../TransactionStep/TransactionStep';

export type TransactionStepsProps = {
  transactions: Transaction[];
  onSuccess?: () => void;
  onClose?: () => void;
  gasPrice: string;
};

export const TransactionSteps: FC<TransactionStepsProps> = ({
  transactions,
  onSuccess,
  onClose,
  gasPrice,
}) => {
  const [items, setItems] = useState<TxConf[]>([]);

  const [step, setStep] = useState(-1);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const initialize = async () => {
      const list: TxConf[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const { request } = transactions[i];

        const item: TxConf = {
          transaction: transactions[i],
          receipt: {
            status: TransactionReceiptStatus.pending,
            request,
          },
          config: {},
        };

        if (request.type === TxType.signTransaction) {
          const args = [...request.args];
          if (request.fnName === APPROVAL_FUNCTION) {
            args[1] = ethers.constants.MaxUint256;
          }
          item.config.gasLimit =
            request.gasLimit ??
            (await request.contract.estimateGas[request.fnName](...args).then(
              gas => gas.toString(),
            ));

          item.config.amount =
            request.fnName === APPROVAL_FUNCTION ? request.args[1] : undefined;
          item.config.unlimitedAmount =
            request.fnName === APPROVAL_FUNCTION ? false : undefined;
          item.config.gasPrice = request.gasPrice ?? gasPrice;
        }

        list.push(item);
      }

      setItems(list);
    };

    if (gasPrice) {
      initialize();
    }
  }, [gasPrice, transactions]);

  const updateConfig = useCallback(
    (index: number, config: TxConfig) => {
      setItems(items => {
        if (items[index]) {
          const copy = [...items];
          copy[index].config = config;
          return copy;
        }
        return items;
      });
    },
    [setItems],
  );

  const handleUpdates = useCallback(() => {
    setItems(items =>
      items.map(item => {
        if (item.transaction.updateHandler) {
          item.transaction.request = item.transaction.updateHandler(
            item.transaction.request,
            items.map(i => i.receipt),
          );
        }
        return item;
      }),
    );
  }, []);

  const submit = useCallback(async () => {
    try {
      let i = 0;
      if (error) {
        setError(false);
        i = step;
      }
      for (; i < transactions.length; i++) {
        setStep(i);
        const config = items[i].config;
        const { request } = transactions[i];
        if (request.type === TxType.signTransaction) {
          const args = [...request.args];
          if (request.fnName === APPROVAL_FUNCTION) {
            args[1] = config.unlimitedAmount
              ? ethers.constants.MaxUint256
              : config.amount;
          }
          const tx = await request.contract[request.fnName](...args, {
            value: request.value,
            gasPrice: config.gasPrice
              ? parseUnits(config.gasPrice?.toString() || '0', 9)
              : undefined,
            gasLimit: config.gasLimit ? config.gasLimit?.toString() : undefined,
          });

          updateConfig(i, { ...config, hash: tx.hash });

          transactions[i].onStart?.(tx.hash);
          transactions[i].onChangeStatus?.(StatusType.pending);

          await tx.wait();

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(tx.hash);

          items[i].receipt = {
            status: TransactionReceiptStatus.success,
            request,
            response: tx.hash,
          };

          handleUpdates();
        } else if (request.type === TxType.signMessage) {
          const signature = await request.signer.signMessage(request.message);

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(signature);

          items[i].receipt = {
            status: TransactionReceiptStatus.success,
            request,
            response: signature,
          };

          handleUpdates();
        } else if (request.type === TxType.signTypedData) {
          const signature = await request.signer._signTypedData(
            request.domain,
            request.types,
            request.value,
          );

          transactions[i].onChangeStatus?.(StatusType.success);
          transactions[i].onComplete?.(signature);

          items[i].receipt = {
            status: TransactionReceiptStatus.success,
            request,
            response: signature,
          };

          handleUpdates();
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
      console.log('error:', error);

      transactions[0].onChangeStatus?.(StatusType.error);

      handleUpdates();

      setError(true);
    }
  }, [error, handleUpdates, items, step, transactions, updateConfig]);

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
    () => step > -1 && step < transactions.length && !error,
    [error, step, transactions.length],
  );

  useEffect(() => {
    if (transactions.length > 0 && transactions.length === step) {
      onSuccess?.();
    }
  }, [onSuccess, step, transactions.length]);

  const getConfig = useCallback((i: number) => items[i].config, [items]);

  if (!items.length) {
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
          updateConfig={(config: TxConfig) => updateConfig(i, config)}
          gasPrice={gasPrice}
        />
      ))}
      {!isLoading && transactions.length > step && (
        <Button
          className="w-full mt-7"
          text={error ? 'Retry' : 'Confirm'}
          onClick={submit}
        />
      )}
      {onClose && transactions.length === step && (
        <Button
          text={t(translations.common.done)}
          onClick={onClose}
          className="w-full mt-7"
        ></Button>
      )}
    </div>
  );
};
