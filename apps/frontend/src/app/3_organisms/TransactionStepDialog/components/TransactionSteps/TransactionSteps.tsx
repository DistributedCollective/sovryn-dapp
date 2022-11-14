import React, { FC, useCallback, useEffect, useState } from 'react';

import { Button, StatusType } from '@sovryn/ui';

import { Transaction, TxCustom } from '../../TransactionStepDialog.types';
import { TransactionStep } from '../TransactionStep/TransactionStep';

export type TransactionStepsProps = {
  transactions: Transaction[];
};

export const TransactionSteps: FC<TransactionStepsProps> = ({
  transactions,
}) => {
  const [configs, setConfigs] = useState<TxCustom[]>([]);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState(false);

  useEffect(() => {
    const initilize = async () => {
      const list: TxCustom[] = [];
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        list.push({
          amount: tx.fnName === 'approve' ? tx.args[1] : undefined,
          unlimitedAmount: tx.fnName === 'approve' ? false : undefined,
          decimals: 18,
          symbol: 'xusd',
          config: { ...tx.config },
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
        await transactions[i].contract[transactions[i].fnName](
          ...transactions[i].args,
          { ...transactions[i].config },
        );
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

  const updateConfig = (index: number, config: TxCustom) => {
    const list = [...configs];
    list[index] = { ...config };
    setConfigs(list);
  };

  return (
    <div className="flex flex-col gap-4">
      {transactions.map((tx, i) => (
        <TransactionStep
          key={tx.title}
          transaction={tx}
          step={i + 1}
          status={getStatus(i)}
          config={configs[i]}
          updateConfig={(config: TxCustom) => updateConfig(i, config)}
        />
      ))}
      <Button className="w-full mt-7" text="Confirm" onClick={submit} />
    </div>
  );
};
