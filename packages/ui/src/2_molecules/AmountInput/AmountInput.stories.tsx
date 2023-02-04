import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { AmountInput, AmountInputVariant } from './AmountInput';

export default {
  title: 'Molecule/AmountInput',
  component: AmountInput,
};

const Template: Story<ComponentProps<typeof AmountInput>> = args => {
  const [value, setValue] = useState((args.value as string) || '0');

  return (
    <div className="w-64">
      <AmountInput {...args} onChangeText={setValue} value={value} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Amount',
  tooltip: 'This is something useful',
  unit: 'BTC',
  value: 123,
  disabled: false,
  readOnly: false,
  dataAttribute: 'amountInput',
  variant: AmountInputVariant.small,
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  unit: 'BTC',
  value: 123,
  disabled: false,
  readOnly: false,
  dataAttribute: 'amountInput',
};

export const WithoutLabelAndUnit = Template.bind({});
WithoutLabelAndUnit.args = {
  value: 123,
  disabled: false,
  readOnly: false,
  dataAttribute: 'amountInput',
};

export const LargeDecimal = Template.bind({});
LargeDecimal.args = {
  label: 'Amount',
  unit: 'BTC',
  value: 0.12345678,
  decimalPrecision: 3,
  dataAttribute: 'amountInput',
};
