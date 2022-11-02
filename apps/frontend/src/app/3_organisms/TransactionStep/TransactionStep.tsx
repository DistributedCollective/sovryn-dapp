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
} from '@sovryn/ui';

import { TransactionGas } from '../components/TransactionGas';

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
};

const options = [
  {
    label: 'Custom amount',
    name: 'settings',
    value: 'custom_amount',
    contentToShow: (
      <AmountInput label="Amount" className="ml-7 mb-5 max-w-60" min={0} />
    ),
  },
  {
    label: 'Unlimited amount',
    name: 'settings',
    value: 'unlimited_amount',
  },
];
export const TransactionStep: FC<TransactionStepProps> = ({
  step,
  status,
  title,
  subtitle,
  txDetails,
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
        </SimpleTable>

        <Accordion
          className="mt-4 text-xs"
          label="Advanced Settings"
          open={advanced}
          onClick={() => setAdvanced(!advanced)}
        >
          <RadioButtonGroup
            options={options}
            onChange={onChange}
            className="mt-1"
          />
          <Heading type={HeadingType.h3} className="mb-3">
            Approval gas setting
          </Heading>
          <TransactionGas limit="0" price="0" />
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
