import { Story } from '@storybook/react';

import React, { ComponentProps, useReducer } from 'react';

import { NavMenuItem } from './NavMenuItem';

export default {
  title: 'Molecule/NavMenuItem',
  component: NavMenuItem,
};

const Template: Story<ComponentProps<typeof NavMenuItem>> = args => (
  <>
    <NavMenuItem {...args} />
  </>
);

export const Basic = Template.bind({});
Basic.args = {
  children: 'Menu item',
  count: 100,
  className: 'm-2',
  isActive: false,
  maxCount: 99,
  dataAttribute: '',
};
Basic.argTypes = {
  children: {
    control: 'text',
    description:
      'The content of the nav menu item. Can be text, other components, or HTML elements.',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the nav menu item',
  },
  count: {
    control: 'number',
    description: 'Count state for the badge',
  },
  maxCount: {
    control: 'number',
    description: 'Maximum count to render on the badge',
  },
  isActive: {
    control: 'boolean',
    description: 'Nav menu item active state',
  },
  onClick: {
    control: 'text',
    description: 'The onClick handler for the nav menu item',
  },
};

const InteractiveTemplate: Story<ComponentProps<typeof NavMenuItem>> = args => {
  const [active, handleToggle] = useReducer(state => !state, false);
  return <NavMenuItem {...args} onClick={handleToggle} isActive={active} />;
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  children: 'Menu item',
  count: 1,
  className: 'm-2',
  isActive: false,
  maxCount: 99,
  dataAttribute: '',
};
Interactive.argTypes = {
  ...Basic.argTypes,
};
