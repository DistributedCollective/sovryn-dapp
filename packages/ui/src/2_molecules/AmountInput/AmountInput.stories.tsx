import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { AmountInput } from './AmountInput';

export default {
  title: 'Molecule/AmountInput',
  component: AmountInput,
};

const Template: Story<ComponentProps<typeof AmountInput>> = args => (
  <div className="w-64">
    <AmountInput {...args} />
  </div>
);

const AdvancedTemplate: Story<ComponentProps<typeof AmountInput>> = args => {
  const [value, setValue] = useState(6);

  return (
    <div className="w-64">
      <AmountInput
        {...args}
        value={value}
        onChangeText={value => setValue(Number(value))}
      />
      <p>
        This value will change after {args.debounce}ms: {value}
      </p>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Amount',
  tooltip: 'This is something useful',
  unit: 'RBTC',
  value: 123,
  disabled: false,
  readOnly: false,
};

export const DebouncedInput = AdvancedTemplate.bind({});
DebouncedInput.args = {
  debounce: 300,
};

export const LongDecimals = Template.bind({});
LongDecimals.args = {
  label: 'Amount',
  unit: 'RBTC',
  value: 0.12345678,
  numDecimals: 3,
};
