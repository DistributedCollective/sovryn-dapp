import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { AmountInput, AmountInputVariant } from './AmountInput';

export default {
  title: 'Molecule/AmountInput',
  component: AmountInput,
};

const Template: Story<ComponentProps<typeof AmountInput>> = args => (
  <div className="w-64">
    <AmountInput {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  label: 'Amount',
  tooltip: 'This is something useful',
  unit: 'RBTC',
  value: 123,
  disabled: false,
  readOnly: false,
  dataLayoutId: 'amountInput',
  variant: AmountInputVariant.small,
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  unit: 'RBTC',
  value: 123,
  disabled: false,
  readOnly: false,
  dataLayoutId: 'amountInput',
};

export const WithoutLabelAndUnit = Template.bind({});
WithoutLabelAndUnit.args = {
  value: 123,
  disabled: false,
  readOnly: false,
  dataLayoutId: 'amountInput',
};

export const LargeDecimal = Template.bind({});
LargeDecimal.args = {
  label: 'Amount',
  unit: 'RBTC',
  value: 0.12345678,
  decimalPrecision: 3,
  dataLayoutId: 'amountInput',
};
