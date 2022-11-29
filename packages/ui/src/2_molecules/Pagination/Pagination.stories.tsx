import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Pagination } from './Pagination';

export default {
  title: 'Molecule/Pagination',
  component: Pagination,
};

const Template: Story<ComponentProps<typeof Pagination>> = args => {
  const [page, setPage] = useState(0);
  return <Pagination {...args} page={page} setPage={setPage} />;
};

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  dataLayoutId: '',
  pageSize: 6,
  totalItems: 22,
};

const _WithNoTotalItems: Story<ComponentProps<typeof Pagination>> = args => {
  const [page, setPage] = useState(0);
  return <Pagination {...args} page={page} setPage={setPage} />;
};

export const WithNoTotalItems = _WithNoTotalItems.bind({});
_WithNoTotalItems.args = {
  className: '',
  dataLayoutId: '',
  pageSize: 6,
};
