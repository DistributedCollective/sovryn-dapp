import React, { FC, useCallback, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import { getProvider } from '@sovryn/ethers-provider';
import {
  Accordion,
  AmountInput,
  Button,
  ButtonType,
  ButtonStyle,
  Heading,
  HeadingType,
  Paragraph,
  RadioButtonGroup,
  SimpleTable,
  SimpleTableRow,
  StatusItem,
  StatusType,
  TransactionId,
} from '@sovryn/ui';

import ERC20_ABI from '../../../../../config/abis/erc20.json';
import { defaultChainId } from '../../../../../config/chains';
import { Transaction, TxConfig } from '../../TransactionStepDialog.types';
import { TransactionGas } from '../TransactionGas/TransactionGas';

interface TransactionDetails {
  amount?: string;
  gasFee: string;
  token: string;
}

export type TransactionStepProps = {
  transaction: Transaction;
  step: string | number;
  status: StatusType;
  config: TxConfig;
  updateConfig: (config: TxConfig) => void;
  reset: () => void;

  txDetails?: TransactionDetails;
  txID?: string;
};

export const TransactionStep: FC<TransactionStepProps> = ({
  step,
  status,
  transaction,
  txDetails,
  txID,
  config,
  updateConfig,
  reset,
}) => {
  const [decimals, setDecimals] = useState(0);
  const [symbol, setSymbol] = useState('');

  const { title, subtitle } = transaction;

  useEffect(() => {
    const init = async () => {
      const contract = new ethers.Contract(
        transaction.contract.address,
        ERC20_ABI,
        getProvider(defaultChainId),
      );

      contract.decimals().then(d => setDecimals(d));
      contract.symbol().then(s => setSymbol(s));
    };

    if (config.amount !== undefined) {
      init();
    }
  }, [
    config.amount,
    transaction.args,
    transaction.contract.address,
    transaction.contract.estimateGas,
    transaction.fnName,
  ]);

  const parsedAmount =
    decimals && config.amount !== undefined
      ? formatUnits(config.amount?.toString(), decimals)
      : '';

  const amountOptions = [
    {
      label: 'Custom amount',
      name: 'settings-' + step,
      value: 'custom_amount',
      contentToShow: (
        <AmountInput
          disabled={!!config.unlimitedAmount}
          label="Amount"
          className="ml-7 mb-5 max-w-60"
          min={0}
          decimalPrecision={18}
          debounce={0}
          value={parsedAmount}
          onChange={e =>
            updateConfig({
              ...config,
              amount: parseUnits(String(e.target.value), decimals),
            })
          }
        />
      ),
      helper:
        'Limiting the amount of approved tokens as an additional security measure may result higher fees',
    },
    {
      label: 'Unlimited amount',
      name: 'settings-' + step,
      value: 'unlimited_amount',
      helper:
        'Limiting the amount of approved tokens as an additional security measure may result higher fees',
    },
  ];

  const [advanced, setAdvanced] = useState(false);
  const onChange = useCallback(
    e => {
      updateConfig({
        ...config,
        unlimitedAmount: e.target.value === 'unlimited_amount',
      });
    },
    [config, updateConfig],
  );
  const disabledSettings = ![StatusType.idle, StatusType.error].includes(
    status,
  );

  return (
    <div className="flex flex-col">
      <StatusItem content={step} label={title} status={status} />
      <div className="ml-10">
        {subtitle && <Paragraph className="text-gray-30">{subtitle}</Paragraph>}
        <SimpleTable className="max-w-72 mt-3">
          {config.amount !== undefined && (
            <SimpleTableRow
              label="Amount"
              value={`${
                config.unlimitedAmount ? 'unlimited' : parsedAmount
              } ${symbol}`}
              valueClassName="text-primary-10"
            />
          )}
          <SimpleTableRow
            label="Estimated gas fee"
            value={txDetails?.gasFee + ' rBTC'}
            valueClassName="text-primary-10"
          />
          {txID && (
            <SimpleTableRow
              label="TX ID"
              value={
                <TransactionId
                  href={`https://explorer.rsk.co/address/${txID}`}
                  value={txID}
                />
              }
            />
          )}
        </SimpleTable>

        <Accordion
          className="mt-4 text-xs"
          label="Advanced Settings"
          open={advanced && !disabledSettings}
          onClick={() => setAdvanced(!advanced)}
          disabled={disabledSettings}
        >
          {config.amount !== undefined && (
            <>
              <RadioButtonGroup
                options={amountOptions}
                onChange={onChange}
                className="mt-1"
                defaultChecked={config.unlimitedAmount ? 1 : 0}
              />
              <Heading type={HeadingType.h3} className="mb-3">
                Approval gas setting
              </Heading>
            </>
          )}

          <TransactionGas
            className="mt-2 mb-4 max-w-64"
            limit={config.gasLimit?.toString()}
            price={config.gasPrice?.toString()}
          />
          <Button
            style={ButtonStyle.ghost}
            type={ButtonType.reset}
            text="Reset values"
            onClick={reset}
          />
        </Accordion>
      </div>
    </div>
  );
};
