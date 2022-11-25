import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { usePaginate } from '../../hooks';
import { AddressTablePagination } from './AddressTablePagination';

export default {
  title: 'Molecule/AddressTablePagination',
  component: AddressTablePagination,
};

const Template: Story<ComponentProps<typeof AddressTablePagination>> = args => {
  const {
    activePage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    nextPage,
    pageCount,
    pageSize,
    previousPage,
  } = usePaginate(args.pageSize, args.length);

  return (
    <AddressTablePagination
      {...args}
      canNextPage={canNextPage}
      canPreviousPage={canPreviousPage}
      gotoPage={gotoPage}
      nextPage={nextPage}
      pageCount={pageCount}
      pageIndex={activePage}
      pageSize={pageSize}
      previousPage={previousPage}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  dataLayoutId: '',
  pageSize: 6,
  length: 22,
};

const _NoLength: Story<
  ComponentProps<typeof AddressTablePagination>
> = args => {
  const {
    activePage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    nextPage,
    pageCount,
    pageSize,
    previousPage,
  } = usePaginate(args.pageSize, args.length);

  return (
    <AddressTablePagination
      {...args}
      canNextPage={canNextPage}
      canPreviousPage={canPreviousPage}
      gotoPage={gotoPage}
      nextPage={nextPage}
      pageCount={pageCount}
      pageIndex={activePage}
      pageSize={pageSize}
      previousPage={previousPage}
    />
  );
};

export const NoLength = _NoLength.bind({});
_NoLength.args = {
  className: '',
  dataLayoutId: '',
  pageSize: 6,
};
