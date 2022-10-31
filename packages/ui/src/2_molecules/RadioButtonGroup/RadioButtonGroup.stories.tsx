import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { Icon } from '../../1_atoms';
import { Input } from '../../1_atoms/Input';
import { Tooltip } from '../Tooltip';
import { RadioButtonGroup } from './RadioButtonGroup';

export default {
  title: 'Molecule/RadioButtonGroup',
  component: RadioButtonGroup,
};

const options = [
  {
    label: 'Unlimited amount',
    name: 'settings',
    value: 'unlimited_amount',
  },
  {
    label: 'Custom amount',
    name: 'settings',
    value: 'custom_amount',
  },
  {
    label: 'Amount with icon',
    labelInfo: (
      <Tooltip
        content="Tooltip info"
        children={
          <div>
            <Icon icon="info" size={10} />
          </div>
        }
      />
    ),
    name: 'settings',
    value: 'amount_with_icon',
  },
  {
    label: 'Disabled amount',
    name: 'settings',
    disabled: true,
    labelInfo: (
      <Tooltip
        content="Tooltip info"
        children={
          <div>
            <Icon icon="info" size={10} />
          </div>
        }
      />
    ),
    value: 'disabled_amount',
  },
];

const Template: Story<ComponentProps<typeof RadioButtonGroup>> = args => {
  const [selectedItem, setSelectedItem] = useState(options[0].value);
  const onChange = useCallback(e => {
    console.log(`Selected value is ${e.target.value}`);
    setSelectedItem(e.target.value);
  }, []);
  return (
    <>
      <RadioButtonGroup {...args} onChange={onChange} />
      {selectedItem === 'custom_amount' && <Input className="ml-8" />}
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Advanced settings',
  options: options,
};
