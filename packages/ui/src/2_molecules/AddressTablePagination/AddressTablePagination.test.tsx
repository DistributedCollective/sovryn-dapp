import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { AddressTablePagination } from './AddressTablePagination';

describe('AddressTablePagination', () => {
  it('renders AddressTablePagination', () => {
    const gotoPage = jest.fn();
    const { findAllByRole } = render(
      <AddressTablePagination
        canNextPage
        canPreviousPage
        gotoPage={gotoPage}
        nextPage={() => gotoPage(2)}
        pageCount={4}
        pageIndex={1}
        pageSize={4}
        previousPage={() => gotoPage(0)}
      />,
    );
    expect(findAllByRole('svg[data-icon="arrow-back"]')).toBeDefined();
  });

  it('does not allow to click Previous without clicking Next first', () => {
    const gotoPage = jest.fn();
    const { getByTestId } = render(
      <AddressTablePagination
        canNextPage
        canPreviousPage
        gotoPage={gotoPage}
        nextPage={() => gotoPage(2)}
        pageCount={4}
        pageIndex={1}
        pageSize={4}
        previousPage={() => gotoPage(0)}
        dataLayoutId="sovryn-table"
      />,
    );

    userEvent.click(getByTestId('sovryn-table-next'));
    expect(gotoPage).toBeCalledTimes(1);
  });
});
