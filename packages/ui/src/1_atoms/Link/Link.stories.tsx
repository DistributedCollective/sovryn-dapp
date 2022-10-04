import { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import { Link } from './Link';
import { LinkStyle } from './Link.types';

export default {
  title: 'Atoms/Link',
  component: Link,
} as ComponentMeta<typeof Link>;

const Template: ComponentStory<typeof Link> = args => <Link {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'test',
  href: 'https://live.sovryn.app/',
  openNewTab: true,
  style: LinkStyle.primary,
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'test',
  href: 'https://live.sovryn.app/',
  openNewTab: true,
  style: LinkStyle.secondary,
};
