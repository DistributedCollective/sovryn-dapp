import React, { FC, useCallback, useEffect, useState } from 'react';

import { Button, StatusType } from '@sovryn/ui';

import { useGasPrice } from '../../../../../hooks/useGasPrice';
import { Transaction, TxConfig } from '../../TransactionStepDialog.types';
import { TransactionStep } from '../TransactionStep/TransactionStep';

export type TransactionStepsProps = {
  transactions: Transaction[];
};

export const TransactionSteps: FC<TransactionStepsProps> = ({
  transactions,
}) => {
  const [configs, setConfigs] = useState<TxConfig[]>([]);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState(false);
  const gasPrice = useGasPrice();

  useEffect(() => {
    const initilize = async () => {
      const list: TxConfig[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        list.push({
          ...tx.config,
          amount: tx.fnName === 'approve' ? tx.args[1] : undefined,
          unlimitedAmount: tx.fnName === 'approve' ? false : undefined,
        });
      }
      setConfigs(list);
    };

    initilize();
  }, [transactions]);

  const submit = useCallback(async () => {
    try {
      let i = 0;
      if (error) {
        setError(false);
        i = step;
      }
      for (; i < transactions.length; i++) {
        setStep(i);
        const tx = await transactions[i].contract[transactions[i].fnName](
          ...transactions[i].args,
          { ...transactions[i].config },
        );
        await tx.wait();
      }

      setStep(transactions.length);
    } catch (error) {
      console.log('error:', error);
      setError(true);
    }
  }, [error, step, transactions]);

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

  if (!configs.length) return null;

  const updateConfig = (index: number, config: TxConfig) => {
    const list = [...configs];
    list[index] = { ...config };
    setConfigs(list);
  };

  const reset = async (index: number) => {
    try {
      const tx = transactions[index];

      const gasLimit = await tx.contract.estimateGas[tx.fnName](...tx.args);

      updateConfig(index, {
        ...tx.config,
        unlimitedAmount: configs[index].unlimitedAmount,
        amount: tx.fnName === 'approve' ? tx.args[1] : undefined,
        gasLimit,
        gasPrice,
      });
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {transactions.map((tx, i) => (
        <TransactionStep
          key={i}
          transaction={tx}
          step={i + 1}
          status={getStatus(i)}
          config={configs[i]}
          updateConfig={(config: TxConfig) => updateConfig(i, config)}
          reset={() => reset(i)}
        />
      ))}
      <Button className="w-full mt-7" text="Confirm" onClick={submit} />
    </div>
  );
};
