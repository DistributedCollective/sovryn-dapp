import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Button, Icon, IconNames, Link } from '../../1_atoms';
import { ButtonStyle } from '../../1_atoms/Button/Button.types';
import SovrynLogo from '../../../assets/images/logo-sovryn.svg';
import { Dropdown } from '../Dropdown';
import { Menu, MenuItem } from '../Menu';
import { NavMenuItem } from '../NavMenuItem/NavMenuItem';
import { WalletIdentity } from '../WalletIdentity/WalletIdentity';
import { Header } from './Header';

export default {
  title: 'Molecule/Header',
  component: Header,
  parameters: {
    backgrounds: {
      default: 'custom',
      values: [
        {
          name: 'custom',
          value: 'white',
        },
      ],
    },
  },
};

const Template: Story<ComponentProps<typeof Header>> = args => (
  <Header {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  dataAttribute: '',
  logo: <Link href="/" text={<img src={SovrynLogo} alt="Sovryn logo" />} />,
  menuItems: (
    <>
      <NavMenuItem children="Zero" />
      <NavMenuItem children="Perpetuals" />
    </>
  ),
  menuIcon: (
    <Button
      text={<Icon icon={IconNames.X_MARK} size={16} />}
      style={ButtonStyle.ghost}
      className="text-white"
    />
  ),
  secondaryContent: (
    <>
      <Button
        className="mr-6"
        text="Send/Receive"
        style={ButtonStyle.secondary}
      />
      <WalletIdentity address="0xEDb8897aB6E907bc63CB256f74437D36298507E2" />
    </>
  ),
};
Basic.argTypes = {
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  logo: {
    control: 'text',
    description: 'The content of the header logo section. Should be an image',
  },
  menuItems: {
    control: 'text',
    description:
      'The content of the header menu section. Can be any components, or HTML elements.',
  },
  secondaryContent: {
    control: 'text',
    description:
      'The right content of the header. Can be text, other components, or HTML elements.',
  },
  isOpen: {
    control: 'boolean',
    description: 'The open state of the header. Used mainly for mobile screens',
  },
  menuIcon: {
    control: 'text',
    description: 'The menu icon element',
  },
  extraContent: {
    control: 'text',
    description:
      'The extra content of the header. Can be text, other components, or HTML elements.',
  },
};

export const WithDropdownMenu = Template.bind({});
WithDropdownMenu.args = {
  dataAttribute: '',
  logo: <Link href="/" text={<img src={SovrynLogo} alt="Sovryn logo" />} />,
  menuItems: (
    <>
      <NavMenuItem children="Zero" />
      <NavMenuItem children="Perpetuals" />
      <Dropdown
        text="Earn"
        className={
          'bg-transparent border-none text-gray-30 font-normal text-sm hover:bg-gray-70 hover:text-gray-10 min-w-auto w-full md:w-auto font-medium'
        }
      >
        <Menu>
          <MenuItem
            text="Lending"
            label="Lend stablecoins and earn interest"
            className="no-underline"
          />
        </Menu>
      </Dropdown>
    </>
  ),
  menuIcon: (
    <Button
      text={<Icon icon={IconNames.X_MARK} size={16} />}
      style={ButtonStyle.ghost}
      className="text-white"
    />
  ),
  secondaryContent: (
    <>
      <Button
        className="mr-6"
        text="Send/Receive"
        style={ButtonStyle.secondary}
      />
      <WalletIdentity address="0xEDb8897aB6E907bc63CB256f74437D36298507E2" />
    </>
  ),
};
