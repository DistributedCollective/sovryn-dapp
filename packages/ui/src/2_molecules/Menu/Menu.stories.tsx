import { faArchway } from '@fortawesome/free-solid-svg-icons';
import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { IconNames } from '../../1_atoms';
import { Menu } from './Menu';
import { MenuItem } from './components/MenuItem/MenuItem';
import { MenuSeparator } from './components/MenuSeparator/MenuSeparator';

export default {
  title: 'Molecule/Menu',
  component: Menu,
  subcomponents: {
    MenuItem,
    MenuSeparator,
  },
};

const Template: Story<ComponentProps<typeof Menu>> = args => <Menu {...args} />;

export const _Menu = Template.bind({});
_Menu.args = {
  className: 'max-w-xs',
  children: [
    <MenuItem text="Alpha" label="href" href="/" />,
    <MenuItem
      text="Beta"
      label="href external"
      href="https://sovryn.app"
      hrefExternal
    />,
    <MenuItem text="Gamma" label="with icon and label" icon={faArchway} />,
    <MenuSeparator />,
    <MenuItem text="Delta" label="onClick" onClick={console.log} />,
    <MenuItem text="Epsilon" />,
    <MenuSeparator text="Zeta" />,
    <MenuItem text="Eta" label="href disabled" href="/" disabled />,
    <MenuItem
      text="Theta"
      label="href external disabled"
      href="https://sovryn.app"
      hrefExternal
      disabled
    />,
    <MenuItem
      text="Iota"
      label="onClick disabled"
      onClick={console.log}
      disabled
    />,
  ],
};
_Menu.argTypes = {
  children: {
    control: 'text',
    description:
      'The menu content. Can be text, other components, or HTML elements.',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the menu',
  },
};

const MenuSeparatorTemplate: Story<
  ComponentProps<typeof MenuSeparator>
> = args => <MenuSeparator {...args} />;

export const _MenuSeparator = MenuSeparatorTemplate.bind({});
_MenuSeparator.args = {
  text: '',
};
_MenuSeparator.argTypes = {
  text: {
    control: 'text',
    description:
      'The menu seprator content. Can be text, other components, or HTML elements.',
  },
};

const MenuItemTemplate: Story<ComponentProps<typeof MenuItem>> = args => (
  <MenuItem {...args} />
);

export const _MenuItem = MenuItemTemplate.bind({});
_MenuItem.args = {
  text: 'Text',
  label: 'label',
  icon: faArchway,
};
_MenuItem.argTypes = {
  text: {
    control: 'text',
    description:
      'The content of the menu item. Can be text, other components, or HTML elements.',
  },
  label: {
    control: 'text',
    description:
      'The content of the menu label. Can be text, other components, or HTML elements.',
  },
  icon: {
    control: 'select',
    options: Object.values(IconNames),
    description: 'The menu item icon',
  },
};
