import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { AddressTablePagination } from './AddressTablePagination';

describe('AddressTablePagination', () => {
  it('renders a AddressTablePagination', () => {
    const onPageChange = jest.fn();
    render(<AddressTablePagination onPageChange={onPageChange} />);
    expect(screen.findAllByRole('svg[data-icon="arrow-back"]')).toBeDefined();
  });

  it('does not allow to click on a disabled button', () => {
    const onPageChange = jest.fn();
    render(<AddressTablePagination onPageChange={onPageChange} />);
    screen.getAllByRole('button').forEach(element => {
      userEvent.click(element);
    });
    expect(onPageChange).toBeCalledTimes(1);
  });
});
