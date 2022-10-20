import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { prettyTx } from '../../utils';
import { TableBase } from './TableBase';
import { Align } from './TableBase.types';

const columns = [
  {
    id: 'index',
    title: 'Index',
    align: Align.center,
    cellRenderer: row => `${row.index}.`,
  },
  {
    id: 'address',
    title: 'Address',
    align: Align.center,
  },
  {
    id: 'balance',
    title: 'Balance',
    align: Align.center,
    cellRenderer: row => `${row.balance} RBTC`,
  },
];

// TODO: Change hardcoded addresses for TransactionId component once it's merged
const rows = [
  {
    index: 1,
    address: prettyTx('0xbcb5a190ACCbc80F4F2c130b5876521E4D5A2C0a', 6, 4),
    balance: 0.2,
  },
  {
    index: 2,
    address: prettyTx('0xop42490ACCbc50F4F9c130b5876521I1q7b3C0p', 6, 4),
    balance: 2,
  },
];

export default {
  title: 'Molecule/TableBase',
  component: TableBase,
};

const Template: Story<ComponentProps<typeof TableBase>> = args => (
  <div className="max-w-lg">
    <TableBase {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  columns,
  rows,
  dataAttribute: 'addressTable',
  rowKey: row => `my-custom-key-${row.index}`,
};

export const WithRowClickHandler = Template.bind({});
WithRowClickHandler.args = {
  columns,
  rows,
  onRowClick: row =>
    alert(`Row with index ${row.index} and address ${row.address} was clicked`),
  dataAttribute: 'addressTable',
  isClickable: true,
};

export const NoData = Template.bind({});
NoData.args = {
  columns,
};
