import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { DynamicValue } from './DynamicValue';

export default {
  title: 'Atoms/DynamicValue',
  component: DynamicValue,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['renderer'],
    },
  },
};

const Template: Story<ComponentProps<typeof DynamicValue>> = args => (
  <DynamicValue {...args} />
);

export const BaseExample = Template.bind({});
BaseExample.args = {
  initialValue: 100,
  value: 100,
  loading: false,
};
BaseExample.argTypes = {
  value: {
    control: 'string',
    description: 'The value to be rendered. Can be text or number',
  },
  initialValue: {
    control: 'string',
    description: 'The initial value. Can be text or number',
  },
  loading: {
    control: 'boolean',
    description: 'Value loading state',
  },
  renderer: {
    control: 'function',
    description: 'The custom function to render the value',
  },
};
