import { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import { Badge } from './Badge';
import { BadgeStyle } from './Badge.types';

export default {
  title: 'Atoms/Badge',
  component: Badge,
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = args => <Badge {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  content: '99',
  style: BadgeStyle.gray,
};
