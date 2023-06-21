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
  dataAttribute: '',
  labelInfo: '',
  disabled: false,
  name: '',
};
Basic.argTypes = {
  label: {
    control: 'text',
    description: 'The label of the radio button',
  },
  name: {
    control: 'text',
    description: 'The name of the radio button',
  },
  id: {
    control: 'text',
    description: 'The id of the radio button element',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the radio button',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attributes to apply to the radio button',
  },
  labelInfo: {
    control: 'text',
    description: 'Label extra information',
  },
  disabled: {
    control: 'boolean',
    description: 'Radio button disable state',
  },
};
