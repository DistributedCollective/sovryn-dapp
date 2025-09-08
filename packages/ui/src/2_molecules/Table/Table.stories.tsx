import { Story } from '@storybook/react';

import React, { ComponentProps, useMemo, useState } from 'react';

import { Table } from './Table';
import { OrderDirection, OrderOptions } from './Table.types';

const columns = [
  {
    id: 'index',
    title: 'Index',
    cellRenderer: row => `${row.index}.`,
    sortable: true,
  },
  {
    id: 'block',
    title: 'Block',
    sortable: true,
  },
  {
    id: 'balance',
    title: 'Balance',
    cellRenderer: row => `${row.balance} BTC`,
  },
];

const rows = [
  {
    index: 1,
    block: 1000,
    balance: 0.2,
  },
  {
    index: 2,
    block: 2000,
    balance: 2,
  },
  {
    index: 3,
    block: 1500,
    balance: 3,
  },
];

export default {
  title: 'Molecule/Table',
  component: Table,
};

const Template: Story<ComponentProps<typeof Table>> = args => {
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'block',
    orderDirection: OrderDirection.Asc,
  });

  const rows = useMemo(() => {
    if (!orderOptions || !orderOptions.orderBy) {
      return args.rows;
    }
    const rows = [...(args.rows || [])];
    const direction =
      orderOptions.orderDirection === OrderDirection.Asc ? 1 : -1;

    rows.sort((a, b) =>
      b[orderOptions.orderBy || ''] > a[orderOptions.orderBy || '']
        ? direction
        : -direction,
    );
    return rows;
  }, [args.rows, orderOptions]);

  return (
    <div className="max-w-sm">
      <Table
        {...args}
        rows={rows}
        setOrderOptions={setOrderOptions}
        orderOptions={orderOptions}
      />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  columns,
  rows,
  dataAttribute: 'balanceTable',
  rowTitle: row => row.address,
};
Basic.argTypes = {
  isClickable: {
    control: 'boolean',
    description: 'The table rows clickable option',
  },
  isLoading: {
    control: 'boolean',
    description: 'The table data loading state',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the table',
  },
  columns: {
    control: 'ColumnOptions[]',
    description: 'List of column configurations',
  },
  rows: {
    control: 'RowType[]',
    description: 'List of table rows',
  },
  rowTitle: {
    control: 'function',
    description: 'Function to generate title for each row on mobile',
  },
  rowKey: {
    control: 'function',
    description: 'Function to generate unique key for each row',
  },
  onRowClick: {
    control: 'function',
    description: 'Fired when user clicks on each row',
  },
  noData: {
    control: 'text',
    description:
      'The content to be shown when no data is available. Can be text, other components, or HTML elements.',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  orderOptions: {
    control: 'OrderOptions',
    description:
      'The table order configuration. Contains order column id and order direction.',
  },
  setOrderOptions: {
    control: 'function',
    description:
      'Callback which gets fired when order options need to be updated.',
  },
  breakpoint: {
    control: 'TableBreakpoint',
    description:
      'The breakpoint on which Table switches from mobile device to desktop',
  },
};

export const NoData = Template.bind({});
NoData.args = {
  columns,
};

NoData.argTypes = {
  ...Basic.argTypes,
};
