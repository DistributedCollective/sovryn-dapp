import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Lead } from './Lead';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Atoms/Lead',
  component: Lead,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Lead>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Lead> = (args) => <Lead {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  test: true,
  children: 'Hello World',
};

export const Secondary = Template.bind({});
Secondary.args = {
  test: false,
  children: 'Hello World',
};
