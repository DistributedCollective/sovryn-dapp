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
Primary.argTypes = {
  content: {
    control: 'text',
    description: 'The content displayed inside the badge',
  },
  style: {
    control: {
      type: 'select',
      options: Object.values(BadgeStyle),
    },
    description: 'The style variant for the badge',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the badge',
  },
  size: {
    control: {
      type: 'select',
    },
    options: ['sm', 'md'],
    description: 'The size of the badge',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attribute to apply to the badge',
  },
};
