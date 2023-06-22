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

Primary.argTypes = {
  text: {
    control: 'text',
    description: 'The text to display in the link',
  },
  href: {
    control: 'text',
    description: 'The href to apply to the link',
  },
  openNewTab: {
    control: 'boolean',
    description: 'Whether to open the link in a new tab',
  },
  style: {
    control: 'select',
    options: Object.values(LinkStyle),
    defaultValue: LinkStyle.primary,
    description: 'The style to apply to the link',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the link',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'test',
  href: 'https://live.sovryn.app/',
  openNewTab: true,
  style: LinkStyle.secondary,
};

Secondary.argTypes = {
  ...Primary.argTypes,
};
