import { Story, Meta } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Bar } from './Bar';

export default {
  title: 'Atoms/Bar',
  component: Bar,
} as Meta;

const Template: Story<ComponentProps<typeof Bar>> = args => <Bar {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: 50,
};

Default.argTypes = {
  value: {
    control: 'number',
    description: 'Value of the bar',
  },
  threshold: {
    control: 'number',
    description: 'Threshold of the bar',
  },
};

export const WithThreshold = Template.bind({});
WithThreshold.args = {
  value: 50,
  threshold: 80,
};
