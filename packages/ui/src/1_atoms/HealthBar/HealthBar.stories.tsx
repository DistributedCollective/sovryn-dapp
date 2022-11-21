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

const _Disabled: ComponentStory<typeof HealthBar> = args => (
  <div className="w-[355px]">
    <HealthBar {...args} value={undefined} />
  </div>
);

export const Disabled = _Disabled.bind({});
