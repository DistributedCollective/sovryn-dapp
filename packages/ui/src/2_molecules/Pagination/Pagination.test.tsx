import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders Pagination', () => {
    const gotoPage = jest.fn();
    const { findAllByRole } = render(
      <Pagination setPage={gotoPage} page={0} totalItems={20} />,
    );
    expect(findAllByRole('svg[data-icon="arrow-back"]')).toBeDefined();
  });

  it('does not allow to click Previous without clicking Next first', () => {
    const gotoPage = jest.fn();
    const { getByTestId } = render(
      <Pagination
        setPage={gotoPage}
        page={0}
        totalItems={20}
        dataLayoutId="sovryn-table"
      />,
    );

    userEvent.click(getByTestId('sovryn-table-next'));
    expect(gotoPage).toBeCalledTimes(1);
  });
});
