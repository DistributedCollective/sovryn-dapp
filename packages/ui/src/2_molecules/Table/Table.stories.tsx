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
    cellRenderer: row => `${row.balance} RBTC`,
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

export const NoData = Template.bind({});
NoData.args = {
  columns,
};
