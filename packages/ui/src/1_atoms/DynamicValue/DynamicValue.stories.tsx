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
