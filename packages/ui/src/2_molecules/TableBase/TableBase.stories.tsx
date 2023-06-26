import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { TransactionId } from '../TransactionId';
import { TableBase } from './TableBase';
import { Align } from './TableBase.types';

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
    cellRenderer: row => `${row.balance} BTC`,
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
  title: 'Molecule/TableBase',
  component: TableBase,
};

const Template: Story<ComponentProps<typeof TableBase>> = args => (
  <div className="max-w-sm">
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
Basic.argTypes = {
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
  rowKey: {
    control: 'function',
    description: 'Function to generate unique key for each row',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to table component instance. This should be unique per component instance on the page',
  },
  isClickable: {
    control: 'boolean',
    description: 'The table rows clickable option',
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
};

export const WithRowClickHandler = Template.bind({});
WithRowClickHandler.args = {
  columns,
  rows,
  onRowClick: row =>
    alert(
      `Row with index ${row.index} and balance ${row.balance} BTC was clicked`,
    ),
  dataAttribute: 'addressTable',
  isClickable: true,
};
WithRowClickHandler.argTypes = {
  ...Basic.argTypes,
};

export const NoData = Template.bind({});
NoData.args = {
  columns,
};
NoData.argTypes = {
  ...Basic.argTypes,
};
