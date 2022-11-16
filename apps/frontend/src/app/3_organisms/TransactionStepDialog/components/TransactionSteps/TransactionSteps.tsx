import React, { FC, useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { Button, Icon, IconNames, StatusType } from '@sovryn/ui';

import { useGasPrice } from '../../../../../hooks/useGasPrice';
import { Transaction, TxConfig } from '../../TransactionStepDialog.types';
import { TransactionStep } from '../TransactionStep/TransactionStep';

export type TransactionStepsProps = {
  transactions: Transaction[];
  onSuccess?: () => void;
};

export const TransactionSteps: FC<TransactionStepsProps> = ({
  transactions,
  onSuccess,
}) => {
  const gasPrice = useGasPrice();

  const [configs, setConfigs] = useState<TxConfig[]>([]);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initilize = async () => {
      const list: TxConfig[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        const gasLimit = await tx.contract.estimateGas[tx.fnName](...tx.args);
        list.push({
          ...tx.config,
          amount: tx.fnName === 'approve' ? tx.args[1] : undefined,
          unlimitedAmount: tx.fnName === 'approve' ? false : undefined,
          gasPrice,
          gasLimit: gasLimit.toString(),
        });
      }
      setConfigs(list);
    };

    if (gasPrice) {
      initilize();
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
        const args = transactions[i].args;
        if (transactions[i].fnName === 'approve') {
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

  const getStatus = (i: number) => {
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
  };
  const isLoading = step > -1 && step < transactions.length && !error;

  if (!configs.length)
    return (
      <Icon
        size={30}
        className="animate-spin mx-auto my-4"
        icon={IconNames.PENDING}
      />
    );

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

      {onSuccess && transactions.length === step && (
        <Button
          text="Done"
          onClick={onSuccess}
          className="w-full mt-7"
        ></Button>
      )}
    </div>
  );
};
