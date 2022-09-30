import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';
import { MenuItem } from '../Menu/components/MenuItem/MenuItem';
import { Menu } from '../Menu/Menu';

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

const AdvancedTemplate: Story<ComponentProps<typeof Dropdown>> = () => {
  const [mode, setMode] = useState(DropdownMode.left);

  const data = Object.keys(DropdownMode).map(item => (
    <MenuItem
      key={item}
      onClick={() => setMode(DropdownMode[item])}
      text={`Set mode to ${item}`}
    />
  ));

  return (
    <Dropdown
      className="m-auto"
      text="Mode control"
      children={<Menu>{data}</Menu>}
      mode={mode}
    />
  );
};

export const Interactive = AdvancedTemplate.bind({});
