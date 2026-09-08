import { render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { i18n } from '../../../locales/i18n';
import { RpcOverrideBanner } from './RpcOverrideBanner';

/**
 * A build with the RPC override in force is labelled mainnet and reads a fork,
 * while the wallet signs against the real network. The URL-shape check in the
 * constants file cannot tell anyone that; only something on screen can.
 */

const OVERRIDE = 'http://127.0.0.1:8545';

let mockOverride: string | undefined;

jest.mock('../../../constants/infrastructure/rsk', () => ({
  get RSK_RPC_OVERRIDE() {
    return mockOverride;
  },
  RSK: { rpc: {}, publicRpc: {}, explorer: {} },
}));

describe('RpcOverrideBanner', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('says the data is not mainnet, and names the RPC in force', () => {
    mockOverride = OVERRIDE;

    const { container } = render(<RpcOverrideBanner />);

    expect(
      container.querySelector('[data-test-id="rpc-override-banner"]'),
    ).toBeInTheDocument();
    expect(screen.getByText(/Not mainnet data/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(OVERRIDE))).toBeInTheDocument();
  });

  it('renders nothing when no override is in force', () => {
    mockOverride = undefined;

    const { container } = render(<RpcOverrideBanner />);

    expect(container).toBeEmptyDOMElement();
  });
});
