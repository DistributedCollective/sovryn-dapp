import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Align } from '../TableBase';
import { TransactionId } from '../TransactionId';
import { Table } from './Table';
import { OrderDirection, OrderOptions } from './Table.types';

const columns = [
  {
    id: 'index',
    title: 'Index',
    align: Align.left,
    cellRenderer: row => `${row.index}.`,
  },
  {
    id: 'address',
    title: 'Address',
    align: Align.left,
  },
  {
    id: 'balance',
    title: 'Balance',
    align: Align.left,
    cellRenderer: row => `${row.balance} RBTC`,
  },
];

// TODO: Change hardcoded addresses for TransactionId component once it's merged
const rows = [
  {
    index: 1,
    address: (
      <TransactionId
        value="0xbcb5a190ACCbc80F4F2c130b5876521E4D5A2C0a"
        href="https://explorer.testnet.rsk.co/address/0xbcb5a190accbc80f4f2c130b5876521e4d5a2c0a"
      />
    ),
    balance: 0.2,
  },
  {
    index: 2,
    address: (
      <TransactionId
        value="0xop42490ACCbc50F4F9c130b5876521I1q7b3C0p"
        href="https://explorer.testnet.rsk.co/address/0xop42490ACCbc50F4F9c130b5876521I1q7b3C0p"
      />
    ),
    balance: 2,
  },
];

export default {
  title: 'Molecule/Table',
  component: Table,
};

const Template: Story<ComponentProps<typeof Table>> = args => {
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: '',
    orderDirection: OrderDirection.Asc,
  });

  return (
    <div className="max-w-sm">
      <Table
        {...args}
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
  dataAttribute: 'addressTable',
  rowKey: row => `my-custom-key-${row.index}`,
  rowTitle: row => row.address,
};

export const WithRowClickHandler = Template.bind({});
WithRowClickHandler.args = {
  columns,
  rows,
  onRowClick: row =>
    alert(
      `Row with index ${row.index} and balance ${row.balance} RBTC was clicked`,
    ),
  dataAttribute: 'addressTable',
  isClickable: true,
  rowTitle: row => row.address,
};

export const NoData = Template.bind({});
NoData.args = {
  columns,
};
