import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Icon } from '../../1_atoms/Icon/Icon';
import { WalletContainer } from './WalletContainer';

export default {
  title: 'Molecule/WalletContainer',
  component: WalletContainer,
};

const Template: Story<ComponentProps<typeof WalletContainer>> = args => (
  <WalletContainer {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  name: 'Ledger',
  icon: '',
  tooltip: '',
  dataLayoutId: '',
  className: '',
};

const Advanced: Story<ComponentProps<typeof WalletContainer>> = args => (
  <div>
    <WalletContainer
      {...args}
      name="Ledger"
      icon={<Icon icon="warning" size={24} className="text-warning" />}
    />
    <br />
    <WalletContainer
      {...args}
      name="Trezor"
      tooltip="tooltip"
      icon={<Icon icon="success-icon" size={25} className="text-primary" />}
    />
  </div>
);

export const WithIcon = Advanced.bind({});
WithIcon.args = {
  dataLayoutId: '',
  className: '',
};
