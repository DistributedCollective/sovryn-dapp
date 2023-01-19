import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { useTranslation } from 'react-i18next';

import { Button, Icon, IconNames, StatusType } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { APPROVAL_FUNCTION } from '../../../../../utils/constants';
import { Transaction, TxConfig } from '../../TransactionStepDialog.types';
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
  const [configs, setConfigs] = useState<TxConfig[]>([]);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const initialize = async () => {
      const list: TxConfig[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        const args = [...tx.args];
        if (tx.fnName === APPROVAL_FUNCTION) {
          args[1] = ethers.constants.MaxUint256;
        }
        const gasLimit = await tx.contract.estimateGas[tx.fnName](...args);
        list.push({
          ...tx.config,
          amount: tx.fnName === APPROVAL_FUNCTION ? tx.args[1] : undefined,
          unlimitedAmount: tx.fnName === APPROVAL_FUNCTION ? false : undefined,
          gasPrice,
          //TODO: replace with default gas limit - increase gas limit by 20% to make sure tx won't fail
          gasLimit: gasLimit.mul(20).div(10).toString(),
        });
      }
      setConfigs(list);
    };

    if (gasPrice) {
      initialize();
    }
  }, [gasPrice, transactions]);

  const updateConfig = useCallback(
    (index: number, config: TxConfig) => {
      const list = [...configs];
      list[index] = { ...config };
      setConfigs(list);
    },
    [configs],
  );

  const submit = useCallback(async () => {
    try {
      let i = 0;
      if (error) {
        setError(false);
        i = step;
      }
      for (; i < transactions.length; i++) {
        setStep(i);
        const config = configs[i];
        const args = [...transactions[i].args];
        if (transactions[i].fnName === APPROVAL_FUNCTION) {
          args[1] = config.unlimitedAmount
            ? ethers.constants.MaxUint256
            : config.amount;
        }
        const tx = await transactions[i].contract[transactions[i].fnName](
          ...args,
          {
            ...transactions[i].config,
            gasPrice: config.gasPrice
              ? parseUnits(config.gasPrice?.toString() || '0', 9)
              : undefined,
            gasLimit: config.gasLimit ? config.gasLimit?.toString() : undefined,
          },
        );

        configs[i] = { ...config, hash: tx.hash };
        setConfigs([...configs]);

        await tx.wait();
        transactions[i].onComplete?.(tx.hash);
      }

      setStep(transactions.length);
    } catch (error) {
      console.log('error:', error);
      setError(true);
    }
  }, [configs, error, step, transactions]);

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

  if (!configs.length) {
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
          config={configs[i]}
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
