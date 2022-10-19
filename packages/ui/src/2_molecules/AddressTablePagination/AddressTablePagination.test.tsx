import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { AddressTablePagination } from './AddressTablePagination';

describe('AddressTablePagination', () => {
  it('renders AddressTablePagination', () => {
    const onPageChange = jest.fn();
    const { findAllByRole } = render(
      <AddressTablePagination onPageChange={onPageChange} />,
    );
    expect(findAllByRole('svg[data-icon="arrow-back"]')).toBeDefined();
  });

  it('does not allow to click Previous without clicking Next first', () => {
    const onPageChange = jest.fn();
    const { getAllByRole } = render(
      <AddressTablePagination onPageChange={onPageChange} />,
    );
    getAllByRole('button').forEach(element => {
      userEvent.click(element);
    });
    expect(onPageChange).toBeCalledTimes(1);
  });
});
