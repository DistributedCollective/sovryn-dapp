import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Menu } from '../Menu/Menu';
import { MenuItem } from '../Menu/components/MenuItem/MenuItem';
import { Dropdown } from './Dropdown';
import { DropdownMode, DropdownSize } from './Dropdown.types';

export default {
  title: 'Molecule/Dropdown',
  component: Dropdown,
};

const Template: Story<ComponentProps<typeof Dropdown>> = args => (
  <div className="flex justify-center">
    <div className="mr-10">
      <p>Small Size</p>
      <Dropdown {...args} size={DropdownSize.small} />
    </div>
    <div>
      <p>Large size</p>
      <Dropdown {...args} />
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  text: 'Dropdown Button',
  children: (
    <Menu>
      <MenuItem text="Dropdown Item 1" />
      <MenuItem text="Dropdown Item 2" />
      <MenuItem text="Dropdown Item 3" />
    </Menu>
  ),
};

const AdvancedTemplate: Story<ComponentProps<typeof Dropdown>> = args => {
  return <Dropdown {...args} />;
};

export const Interactive = AdvancedTemplate.bind({});
Interactive.args = {
  text: 'Mode control',
  size: DropdownSize.large,
  className: 'm-auto',
  mode: DropdownMode.center,
  children: (
    <Menu>
      <MenuItem text="Dropdown Menu Item 1" />
      <MenuItem text="Dropdown Menu Item 2" />
      <MenuItem text="Dropdown Menu Item 3" />
    </Menu>
  ),
};
