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
  dataAttribute: 'address-id',
  href: 'https://explorer.rsk.co/address/0xEDb8897aB6E907bc63CB256f74437D36298507E2',
};
_TransactionId.argTypes = {
  value: {
    control: 'text',
    description: 'Transaction hash',
  },
  startLength: {
    control: 'number',
    description: 'Number of character to show from beginning of the hash',
  },
  endLength: {
    control: 'number',
    description: 'Number of character to show from end of the hash',
  },
  className: {
    control: 'text',
    description: 'The class to apply to target element',
  },
  hideTooltip: {
    control: 'boolean',
    description: 'Configuration to hide the tooltip',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  href: {
    control: 'text',
    description: 'Transaction link to the explorer',
  },
  onCopyAddress: {
    control: 'function',
    description: 'Handler for the when the user tries to copy the address',
  },
};
