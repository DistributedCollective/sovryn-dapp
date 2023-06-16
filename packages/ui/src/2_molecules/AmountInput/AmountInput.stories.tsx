import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback } from 'react';

import { AmountInput, AmountInputVariant } from './AmountInput';

export default {
  title: 'Molecule/AmountInput',
  component: AmountInput,
};

const Template: Story<ComponentProps<typeof AmountInput>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (value: string) => updateArgs({ value }),
    [updateArgs],
  );

  return (
    <div className="w-64">
      <AmountInput {...args} onChangeText={handleOnChange} />
      <p>Value: {args.value}</p>
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

Basic.argTypes = {
  label: {
    control: 'text',
    description: 'The label of the input.',
  },
  variant: {
    control: 'select',
    options: Object.values(AmountInputVariant),
    defaultValue: AmountInputVariant.large,
    description: 'The amount input variant',
  },
  value: {
    control: 'text',
    description: 'The value of the input',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attributes to apply to the input',
  },
  tooltip: {
    control: 'string',
    description: 'The optional tooltip to shown on the helper icon',
  },
  maxAmount: {
    control: 'number',
    description: 'The maximum amount applied on the input',
  },
  decimalPrecision: {
    control: 'number',
    description: 'The number of decimal precision for the value',
  },
  unit: {
    control: 'string',
    description: 'The optional unit to shown after the value',
  },
  readOnly: {
    control: 'boolean',
    description: 'The option to make the input read only',
  },
  onChangeText: {
    control: 'function',
    description:
      "The onChange handler for the input, triggered whenever the input's value changes",
  },
  invalid: {
    control: 'boolean',
    description:
      'Whether the input is invalid. When set to true the error state styling and behaviour will be triggered on the input',
  },
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  unit: 'BTC',
  value: 123,
  disabled: false,
  readOnly: false,
  dataAttribute: 'amountInput',
};
WithoutLabel.argTypes = {
  ...Basic.argTypes,
};

export const WithoutLabelAndUnit = Template.bind({});
WithoutLabelAndUnit.args = {
  value: 123,
  disabled: false,
  readOnly: false,
  dataAttribute: 'amountInput',
};
WithoutLabelAndUnit.argTypes = {
  ...Basic.argTypes,
};

export const LargeDecimal = Template.bind({});
LargeDecimal.args = {
  label: 'Amount',
  unit: 'BTC',
  value: 0.12345678,
  decimalPrecision: 3,
  dataAttribute: 'amountInput',
};
LargeDecimal.argTypes = {
  ...Basic.argTypes,
};
