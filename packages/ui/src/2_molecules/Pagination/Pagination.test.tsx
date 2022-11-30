import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders Pagination', () => {
    const gotoPage = jest.fn();
    const { findAllByRole } = render(
      <Pagination onChange={gotoPage} page={0} totalItems={20} />,
    );
    expect(findAllByRole('svg[data-icon="arrow-back"]')).toBeDefined();
  });

  it('previous button is disabled on first page', () => {
    const gotoPage = jest.fn();
    const { getByTestId } = render(
      <Pagination
        onChange={gotoPage}
        page={0}
        totalItems={20}
        dataAttribute="sovryn-table"
      />,
    );
    userEvent.click(getByTestId('sovryn-table-previous'));
    expect(gotoPage).toBeCalledTimes(0);
  });
});
