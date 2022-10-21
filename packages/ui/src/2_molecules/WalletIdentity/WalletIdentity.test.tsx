import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { prettyTx } from '../../utils';
import { WalletIdentity } from './WalletIdentity';

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe('WalletIdentity', () => {
  beforeEach(() => {
    jest.spyOn(navigator.clipboard, 'writeText');
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  test('renders WalletIdentity', async () => {
    const testAddress = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';
    const { getByText } = render(
      <WalletIdentity
        address={testAddress}
        onDisconnect={() => {}}
        startLength={4}
        endLength={4}
        dataLayoutId="walletIdentityTest"
      />,
    );
    const addressBadge = getByText(prettyTx(testAddress, 4, 4));

    expect(addressBadge).toBeDefined();
    expect(addressBadge).toHaveAttribute(
      'data-layout-id',
      'walletIdentityTest',
    );
  });

  test('copy address button', async () => {
    const testAddress = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';
    const { getByText, getByTestId } = render(
      <WalletIdentity
        address={testAddress}
        onDisconnect={() => {}}
        startLength={4}
        endLength={4}
        dataLayoutId="walletIdentityTest"
      />,
    );
    const addressBadge = getByText(prettyTx(testAddress, 4, 4));

    userEvent.click(addressBadge);

    const copyButton = getByTestId('walletIdentityTest-menu-copyAddress');
    expect(copyButton).toBeInTheDocument();

    userEvent.click(copyButton!);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testAddress);
  });

  test('disconnect button', async () => {
    const disconnectFunction = jest.fn();
    const testAddress = '0x32Be343B94f860124dC4fEe278FDCBD38C102D88';
    const { getByText, getByTestId } = render(
      <WalletIdentity
        address={testAddress}
        onDisconnect={disconnectFunction}
        startLength={4}
        endLength={4}
        dataLayoutId="disconnectTest"
      />,
    );
    const addressBadge = getByText(prettyTx(testAddress, 4, 4));

    userEvent.click(addressBadge);

    const disconnectButton = getByTestId('disconnectTest-menu-disconnect');
    expect(disconnectButton).toBeInTheDocument();

    userEvent.click(disconnectButton!);
    expect(disconnectFunction).toHaveBeenCalled();
  });
});
