import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback } from 'react';

import { Datepicker, DatepickerVariant } from './Datepicker';

export default {
  title: 'Molecule/Datepicker',
  component: Datepicker,
};

const Template: Story<ComponentProps<typeof Datepicker>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (value: number) => updateArgs({ value }),
    [updateArgs],
  );

  return (
    <div className="w-64">
      <Datepicker {...args} onChange={handleOnChange} />
      <p>Value: {args.value}</p>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Amount',
  tooltip: 'This is something useful',
  min: 1693353600,
  value: 1693440000,
  disabled: false,
  dataAttribute: 'Datepicker',
  variant: DatepickerVariant.small,
};
