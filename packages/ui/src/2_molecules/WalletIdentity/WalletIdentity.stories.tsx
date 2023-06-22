import { ComponentMeta, Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { WalletIdentity } from './WalletIdentity';
import { AddressBadge } from './components/AddressBadge/AddressBadge';
import { DisconnectSubmenu } from './components/DisconnectSubmenu/DisconnectSubmenu';

export default {
  title: 'Molecule/WalletIdentity',
  component: WalletIdentity,
  subcomponents: {
    AddressBadge,
    DisconnectSubmenu,
  },
  argTypes: {
    hideSubmenu: {
      defaultValue: false,
    },
    startLength: {
      defaultValue: 4,
    },
    endLength: {
      defaultValue: 4,
    },
  },
} as ComponentMeta<typeof WalletIdentity>;

const Template: Story<ComponentProps<typeof WalletIdentity>> = args => (
  <WalletIdentity {...args} />
);

export const _WalletIdentity = Template.bind({});
_WalletIdentity.args = {
  onDisconnect: () => alert('disconnected'),
  address: '0xEDb8897aB6E907bc63CB256f74437D36298507E2',
  dataAttribute: 'walletIdentity',
  submenuLabels: {
    copyAddress: 'Copy Address',
    disconnect: 'Disconnect',
  },
};
_WalletIdentity.argTypes = {
  onDisconnect: {
    control: 'function',
    description: 'Handler for when user disconnect their wallet',
  },
  onCopyAddress: {
    control: 'function',
    description: 'Handler for when user copies the wallet address',
  },
  address: {
    control: 'text',
    description: 'User wallet address',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the wrapper',
  },
  hideSubmenu: {
    control: 'boolean',
    description: 'A prop to hide the sub-menu',
  },
  content: {
    control: 'text',
    description:
      'The sub-menu open button content. Can be text, other components, or HTML elements.',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  startLength: {
    control: 'number',
    description:
      'Number of character to show from beginning of the wallet address',
  },
  endLength: {
    control: 'number',
    description: 'Number of character to show from end of the wallet address',
  },
};

const DisconnectSubmenuTemplate: Story<
  ComponentProps<typeof DisconnectSubmenu>
> = args => (
  <div style={{ width: '200px' }}>
    <DisconnectSubmenu {...args} />
  </div>
);

export const _DisconnectSubmenu = DisconnectSubmenuTemplate.bind({});
_DisconnectSubmenu.args = {
  onDisconnect: () => alert('disconnected'),
  address: '0xEDb8897aB6E907bc63CB256f74437D36298507E2',
};
_DisconnectSubmenu.argTypes = {
  ..._WalletIdentity.argTypes,
};
