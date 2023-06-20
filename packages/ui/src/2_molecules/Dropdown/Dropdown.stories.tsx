import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

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
    <Dropdown {...args} />
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
  size: DropdownSize.large,
  mode: DropdownMode.sameWidth,
};
Basic.argTypes = {
  text: {
    control: 'text',
    description:
      'The content of the dropdown button. Can be text, other components, or HTML elements.',
  },
  children: {
    control: 'text',
    description:
      'The content of the dropdown. Can be text, other components, or HTML elements.',
  },
  mode: {
    control: 'select',
    options: Object.values(DropdownMode),
    defaultValue: DropdownMode.sameWidth,
    description: 'The dropdown mode',
  },
  size: {
    control: 'select',
    options: Object.values(DropdownSize),
    defaultValue: DropdownSize.large,
    description: 'The dropdown size',
  },
  onOpen: {
    control: 'function',
    description:
      'The onOpen handler for the dropdown, triggered when dropdown is opened',
  },
  onClose: {
    control: 'function',
    description:
      'The onClose handler for the dropdown, triggered when dropdown is closed',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the dropdown trigger button',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  dropdownClassName: {
    control: 'text',
    description: 'The className to apply to the dropdown content',
  },
  closeOnClick: {
    control: 'boolean',
    description: 'The setting to close dropdown when clicked on the content',
  },
  usePortal: {
    control: 'boolean',
    description: 'The setting to use portal for the dropdown or not',
    defaultValue: true,
  },
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
Interactive.argTypes = {
  ...Basic.argTypes,
};
