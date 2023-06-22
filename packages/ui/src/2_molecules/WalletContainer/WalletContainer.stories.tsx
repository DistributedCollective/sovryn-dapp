import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Icon } from '../../1_atoms/Icon/Icon';
import { IconNames } from '../../1_atoms/Icon/Icon.types';
import { WalletContainer } from './WalletContainer';

export default {
  title: 'Molecule/WalletContainer',
  component: WalletContainer,
};

const Template: Story<ComponentProps<typeof WalletContainer>> = args => (
  <div style={{ width: '200px' }}>
    <WalletContainer
      {...args}
      onClick={() => alert('WalletContainer clicked')}
    />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  name: 'Ledger',
  icon: '',
  helper: '',
  dataAttribute: '',
  className: '',
};
Basic.argTypes = {
  name: {
    control: 'text',
    description: 'Wallet name',
  },
  icon: {
    control: 'text',
    description: 'Optional icon for the wallet',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the wrapper',
  },
  helper: {
    control: 'text',
    description: 'Extra information about shown as helper icon',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};

const Advanced: Story<ComponentProps<typeof WalletContainer>> = args => (
  <div style={{ width: '200px' }}>
    <WalletContainer
      {...args}
      name="Ledger"
      icon={<Icon icon={IconNames.INFO} size={24} className="text-warning" />}
      onClick={() => alert('Ledger clicked')}
    />
    <br />
    <WalletContainer
      {...args}
      name="Trezor"
      helper="tooltip"
      icon={
        <Icon
          icon={IconNames.NOTIFICATIONS}
          size={25}
          className="text-primary"
        />
      }
      onClick={() => alert('Trezor clicked')}
    />
  </div>
);

export const WithIcon = Advanced.bind({});
WithIcon.args = {
  dataAttribute: '',
  className: '',
};
WithIcon.argTypes = {
  ...Basic.argTypes,
};
