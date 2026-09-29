import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

import { ChainIds } from '@sovryn/ethers-provider';

import { i18n } from '../../../locales/i18n';
import { ConnectWalletButton } from './ConnectWalletButton';

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const ID = 'dapp-header-connect';

let mockChainId: string;

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: jest.fn() }),
}));

jest.mock('../../../hooks/useChainStore', () => ({
  useCurrentChain: () => mockChainId,
}));

const openMenu = (chainId: string = ChainIds.RSK_MAINNET) => {
  mockChainId = chainId;
  const view = render(
    <MemoryRouter>
      <ConnectWalletButton
        onConnect={jest.fn()}
        onDisconnect={jest.fn()}
        address={ACCOUNT}
        dataAttribute={ID}
      />
    </MemoryRouter>,
  );
  userEvent.click(screen.getByText(/^0x11/));
  return view;
};

const menuEntry = (name: string) =>
  document.querySelector(
    `[data-layout-id="${ID}-menu-${name}"]`,
  ) as HTMLElement;

describe('ConnectWalletButton account menu', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    // The address badge draws an identicon on a canvas; the test config resets
    // the canvas mock before every test, so give the canvas back a minimal
    // 2d context.
    HTMLCanvasElement.prototype.getContext = (() => ({
      fillStyle: '',
      fillRect: () => {},
    })) as unknown as HTMLCanvasElement['getContext'];
    HTMLCanvasElement.prototype.toDataURL = () => '';
  });

  it('opens the Perimeter vault page from the account menu', () => {
    openMenu();

    const entry = menuEntry('perimeter');
    expect(entry).toHaveTextContent('Perimeter vault');
    expect(entry.closest('a')).toHaveAttribute('href', '/perimeter');
  });

  it('lists the Perimeter vault after History and before Notifications', () => {
    openMenu();

    const order = Array.from(
      document.querySelectorAll(`[data-layout-id^="${ID}-menu-"]`),
    )
      .map(node =>
        node.getAttribute('data-layout-id')!.replace(`${ID}-menu-`, ''),
      )
      .filter(name =>
        [
          'portfolio',
          'rewards',
          'history',
          'perimeter',
          'notifications',
        ].includes(name),
      );

    expect(order).toEqual([
      'portfolio',
      'rewards',
      'history',
      'perimeter',
      'notifications',
    ]);
  });

  it('shows the Perimeter vault entry on every chain, unlike Notifications', () => {
    openMenu(ChainIds.BOB_MAINNET);

    expect(menuEntry('perimeter')).not.toHaveClass('hidden');
    expect(menuEntry('notifications')).toHaveClass('hidden');
  });
});
