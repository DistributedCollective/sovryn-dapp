import React, { FC, useCallback, useState } from 'react';

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

import { Transaction, TxCustom } from '../../TransactionStepDialog.types';
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
  config: TxCustom;
  updateConfig: (config: TxCustom) => void;

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
}) => {
  const { title, subtitle } = transaction;

  const amountOptions = [
    {
      label: 'Custom amount',
      name: 'settings-' + step,
      value: 'custom_amount',
      contentToShow: (
        <AmountInput
          disabled={config.unlimitedAmount}
          label="Amount"
          className="ml-7 mb-5 max-w-60"
          min={0}
          decimalPrecision={18}
          debounce={0}
          value={config.amount?.toString()}
          onChange={e =>
            updateConfig({
              ...config,
              amount: Number(e.target.value),
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
                config.unlimitedAmount ? 'unlimited' : config.amount.toString()
              } ${config.symbol}`}
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

          <TransactionGas className="mt-2 mb-4 max-w-64" limit="0" price="0" />
          <Button
            style={ButtonStyle.ghost}
            type={ButtonType.reset}
            text="Reset values"
          />
        </Accordion>
      </div>
    </div>
  );
};
