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

import { TransactionGas } from './components/TransactionGas/TransactionGas';

interface TransactionDetails {
  amount?: string;
  gasFee: string;
  token: string;
}

export type TransactionStepProps = {
  title: string;
  subtitle?: string;
  step: string;
  status: StatusType;
  txDetails?: TransactionDetails;
  txID?: string;
};

const options = [
  {
    label: 'Custom amount',
    name: 'settings',
    value: 'custom_amount',
    contentToShow: (
      <AmountInput label="Amount" className="ml-7 mb-5 max-w-60" min={0} />
    ),
    helper:
      'Limiting the amount of approved tokens as an additional security measure may result higher fees',
  },
  {
    label: 'Unlimited amount',
    name: 'settings',
    value: 'unlimited_amount',
    helper:
      'Limiting the amount of approved tokens as an additional security measure may result higher fees',
  },
];
export const TransactionStep: FC<TransactionStepProps> = ({
  step,
  status,
  title,
  subtitle,
  txDetails,
  txID,
}) => {
  const [advanced, setAdvanced] = useState(false);
  const [, setSelectedItem] = useState(options[0].value);
  const onChange = useCallback(e => {
    setSelectedItem(e.target.value);
  }, []);

  return (
    <div className="flex flex-col">
      <StatusItem content={step} label={title} status={status} />
      <div className="ml-10">
        {subtitle && <Paragraph className="text-gray-30">{subtitle}</Paragraph>}
        <SimpleTable className="max-w-72 mt-3">
          {txDetails?.amount && (
            <SimpleTableRow
              label="Amount"
              value={`${txDetails?.amount} ${txDetails?.token}`}
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
          open={advanced && status === StatusType.idle}
          onClick={() => setAdvanced(!advanced)}
          disabled={status !== StatusType.idle}
        >
          <RadioButtonGroup
            options={options}
            onChange={onChange}
            className="mt-1"
          />
          <Heading type={HeadingType.h3} className="mb-3">
            Approval gas setting
          </Heading>
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
