import { render } from '@testing-library/react';

import React from 'react';

import { WalletIdentity } from './WalletIdentity';

describe('WalletIdentity', () => {
  test('renders WalletIdentity', () => {
    render(
      <WalletIdentity
        address="0x32Be343B94f860124dC4fEe278FDCBD38C102D88"
        onDisconnect={() => {}}
      />,
    );
  });
});
