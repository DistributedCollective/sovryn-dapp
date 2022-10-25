import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { prettyTx } from '../../utils';
import { TransactionId } from './TransactionId';

const testAddress = '0xEDb8897aB6E907bc63CB256f74437D36298507E2';

describe('TransactionId', () => {
  test('should render short transaction id', () => {
    const { getByTestId } = render(
      <TransactionId
        value={testAddress}
        dataLayoutId="address"
        href={`https://explorer.rsk.co/search/${testAddress}`}
      />,
    );
    expect(getByTestId('address')).toBeDefined();
    expect(getByTestId('address')).toHaveTextContent(
      prettyTx(testAddress, 6, 4),
    );
  });

  test('should open transaction link and copy button on click', () => {
    const { getByTestId } = render(
      <TransactionId
        value={testAddress}
        dataLayoutId="address"
        href={`https://explorer.rsk.co/search/${testAddress}`}
      />,
    );
    userEvent.click(getByTestId('address'));
    expect(getByTestId('transaction-link')).toBeDefined();
    expect(getByTestId('transaction-copy')).toBeDefined();
  });
});
