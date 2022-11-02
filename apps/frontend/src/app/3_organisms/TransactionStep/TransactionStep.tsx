import React, { FC, useCallback, useState } from 'react';

import {
  Accordion,
  Input,
  Paragraph,
  RadioButtonGroup,
  SimpleTable,
  SimpleTableRow,
  StatusItem,
  StatusType,
} from '@sovryn/ui';

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
    contentToShow: <Input className="ml-7 mb-5" />,
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
  const [selectedItem, setSelectedItem] = useState(options[0].value);
  const onChange = useCallback(e => {
    setSelectedItem(e.target.value);
  }, []);

  return (
    <div className="flex flex-col">
      <StatusItem content={step} label={title} status={status} />
      <div className="ml-10">
        {subtitle && <Paragraph className="text-gray-30">{subtitle}</Paragraph>}
        <SimpleTable className="max-w-80 mt-3">
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
          <RadioButtonGroup options={options} onChange={onChange} />
        </Accordion>

        {selectedItem === 'custom_amount' && <div>Custom</div>}
      </div>
    </div>
  );
};
