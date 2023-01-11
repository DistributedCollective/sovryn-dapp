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
