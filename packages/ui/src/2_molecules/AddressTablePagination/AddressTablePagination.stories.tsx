import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { AddressTablePagination } from './AddressTablePagination';

export default {
  title: 'Molecule/AddressTablePagination',
  component: AddressTablePagination,
};

const Template: Story<ComponentProps<typeof AddressTablePagination>> = args => (
  <>
    <AddressTablePagination
      {...args}
      onPageChange={offset => alert('offset - ' + offset)}
    />
  </>
);

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  dataLayoutId: '',
  itemsPerPage: 5,
};
