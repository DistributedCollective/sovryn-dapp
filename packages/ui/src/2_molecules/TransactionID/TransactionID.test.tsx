import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { prettyTx } from '../../utils';
import { TransactionID } from './TransactionID';

describe('TransactionID', () => {
  test('should render short transaction id', () => {
    const testAddress = '0xEDb8897aB6E907bc63CB256f74437D36298507E2';
    const { getByTestId } = render(
      <TransactionID value={testAddress} dataLayoutId="address" />,
    );
    expect(getByTestId('address')).toBeDefined();
    expect(getByTestId('address')).toHaveTextContent(
      prettyTx(testAddress, 6, 4),
    );
  });

  test('should open transaction link and copy button on click', () => {
    const { getByTestId } = render(
      <TransactionID
        value="0xEDb8897aB6E907bc63CB256f74437D36298507E2"
        dataLayoutId="address"
      />,
    );
    userEvent.click(getByTestId('address'));
    expect(getByTestId('transaction-link')).toBeDefined();
    expect(getByTestId('transaction-copy')).toBeDefined();
  });
});
