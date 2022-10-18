import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { noop } from '../../utils';
import { AddressTablePagination } from './AddressTablePagination';

export default {
  title: 'Molecule/AddressTablePagination',
  component: AddressTablePagination,
};

const Template: Story<ComponentProps<typeof AddressTablePagination>> = args => (
  <>
    <AddressTablePagination {...args} />
  </>
);

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  dataLayoutId: '',
  limit: 5,
  onPageChange: noop,
};
