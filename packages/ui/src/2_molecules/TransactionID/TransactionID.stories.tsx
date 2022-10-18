import { ComponentMeta, Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { TransactionID } from './TransactionID';

export default {
  title: 'Molecule/TransactionID',
  component: TransactionID,
} as ComponentMeta<typeof TransactionID>;

const Template: Story<ComponentProps<typeof TransactionID>> = args => (
  <div className="flex items-center justify-center w-full">
    <TransactionID {...args} />
  </div>
);

export const _TransactionID = Template.bind({});
_TransactionID.args = {
  value: '0xEDb8897aB6E907bc63CB256f74437D36298507E2',
  dataLayoutId: 'address-id',
};
