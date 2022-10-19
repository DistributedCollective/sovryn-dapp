import { ComponentMeta, Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { TransactionId } from './TransactionId';

export default {
  title: 'Molecule/TransactionId',
  component: TransactionId,
} as ComponentMeta<typeof TransactionId>;

const Template: Story<ComponentProps<typeof TransactionId>> = args => (
  <div className="flex items-center justify-center w-full">
    <TransactionId {...args} />
  </div>
);

export const _TransactionId = Template.bind({});
_TransactionId.args = {
  value: '0xEDb8897aB6E907bc63CB256f74437D36298507E2',
  dataLayoutId: 'address-id',
  href: 'https://explorer.rsk.co/search/0xEDb8897aB6E907bc63CB256f74437D36298507E2',
};
