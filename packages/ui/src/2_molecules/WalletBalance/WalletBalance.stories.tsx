import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { SimpleTableRow } from '../SimpleTable';
import { WalletBalance } from './WalletBalance';

export default {
  title: 'Molecule/WalletBalance',
  component: WalletBalance,
};

const Template: Story<ComponentProps<typeof WalletBalance>> = args => (
  <div className="max-w-32">
    <WalletBalance {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <>
      <SimpleTableRow label="RBTC" value="0.05" />
      <SimpleTableRow label="ZUSD" value="36.35" />
      <SimpleTableRow label="XUSD" value="05.35" />
      <SimpleTableRow label="DLLR" value="26,000.00" />
    </>
  ),
};
