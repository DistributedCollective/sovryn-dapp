import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { RadioButton } from './RadioButton';

export default {
  title: 'Molecule/RadioButton',
  component: RadioButton,
};

const Template: Story<ComponentProps<typeof RadioButton>> = args => (
  <RadioButton {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  label: 'Custom amount',
  id: 'label',
  className: '',
  dataLayoutId: '',
  labelInfo: '',
  disabled: false,
  name: '',
};
