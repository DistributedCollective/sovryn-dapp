import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback } from 'react';

import { Select } from './Select';
import { SelectOption } from './Select.types';

export default {
  title: 'Molecule/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['onChange', 'labelRenderer'],
    },
  },
};

const options: SelectOption[] = [
  {
    value: '1',
    label: 'Option 1',
  },
  {
    value: '2',
    label: 'Option 2',
  },
  {
    value: '3',
    label: 'Option 3',
  },
];

const advancedOptions: SelectOption[] = [
  {
    value: '1',
    label: 'Normal Label width',
  },
  {
    value: '2',
    label: 'Long Label with a lot of text',
  },
  {
    value: '3',
    label: 'Short Label',
  },
];

const Template: Story<ComponentProps<typeof Select>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (value: string) => updateArgs({ value }),
    [updateArgs],
  );

  return (
    <div>
      <Select {...args} onChange={handleOnChange} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  value: options[0].value,
  options,
};

export const AdvancedSelect = Template.bind({});
AdvancedSelect.args = {
  value: advancedOptions[0].value,
  options: advancedOptions,
};
