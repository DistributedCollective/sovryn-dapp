import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { prettyTx } from '../../utils';
import { TableBase } from './TableBase';
import { Align } from './TableBase.types';

const testColumns = [
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

const testRows = [
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

describe('TableBase', () => {
  test('should render a table with 2 items', () => {
    const { getAllByTestId } = render(
      <TableBase columns={testColumns} rows={testRows} dataAttribute="table" />,
    );

    const rows = getAllByTestId('table-row', { exact: false });
    expect(rows.length).toBe(2);
  });

  test('should click on an item if onRowClick is provided', () => {
    const handleClick = jest.fn();

    const { getByTestId } = render(
      <TableBase
        columns={testColumns}
        rows={testRows}
        dataAttribute="table"
        onRowClick={handleClick}
      />,
    );

    const row = getByTestId('table-row-1');
    userEvent.click(row);

    expect(handleClick).toBeCalledTimes(1);
  });

  test('should contain an empty message if there are no rows', () => {
    const noDataText = 'You should see this as there are no rows';
    const { getByText } = render(
      <TableBase columns={testColumns} noData={noDataText} />,
    );

    const emptyText = getByText(noDataText);
    expect(emptyText).toBeInTheDocument();
  });
});
