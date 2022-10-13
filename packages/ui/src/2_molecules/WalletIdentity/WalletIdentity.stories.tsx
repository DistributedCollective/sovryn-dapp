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
  dataActionId: 'walletIdentity',
  submenuLabels: {
    copyAddress: 'Copy Address',
    disconnect: 'Disconnect',
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
