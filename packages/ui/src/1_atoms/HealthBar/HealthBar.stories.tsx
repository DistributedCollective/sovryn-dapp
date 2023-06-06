import { ComponentStory } from '@storybook/react';

import React from 'react';

import { HealthBar } from './HealthBar';

export default {
  title: 'Atoms/HealthBar',
  component: HealthBar,
};

const Template: ComponentStory<typeof HealthBar> = args => (
  <div className="w-[355px]">
    <HealthBar {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  start: 90,
  end: 250,
  middleStart: 110,
  middleEnd: 150,
  value: 200,
};

Default.argTypes = {
  start: {
    control: 'number',
    description: 'The start value of the bar',
  },
  end: {
    control: 'number',
    description: 'The end value of the bar',
  },
  middleStart: {
    control: 'number',
    description: 'The start value of the middle bar',
  },
  middleEnd: {
    control: 'number',
    description: 'The end value of the middle bar',
  },
  value: {
    control: 'number',
    description: 'The value of the bar',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the bar',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};

export const Disabled = Template.bind({});

Disabled.args = {
  start: 90,
  end: 250,
  middleStart: 110,
  middleEnd: 150,
  value: undefined,
};

Disabled.argTypes = {
  ...Default.argTypes,
};
