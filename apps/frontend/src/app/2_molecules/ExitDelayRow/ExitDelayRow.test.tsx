import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../../../locales/i18n';
import { ExitDelayRow } from './ExitDelayRow';

jest.mock('nanoid', () => {
  return { nanoid: () => '1234' };
});

jest.mock('../../../contexts/NotificationContext', () => {
  return {
    useNotificationContext: () => ({
      addNotification: jest.fn(),
    }),
  };
});

const renderRow = (delaySeconds: number, unknown = false, loading = false) =>
  render(
    <MemoryRouter>
      <ExitDelayRow
        delaySeconds={delaySeconds}
        unknown={unknown}
        loading={loading}
      />
    </MemoryRouter>,
  );

describe('ExitDelayRow', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('renders nothing when the perimeter imposes no delay', () => {
    const { container } = renderRow(0);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the hold duration in whole units', () => {
    const { container } = renderRow(172800);
    expect(screen.getByText('Withdrawal delay')).toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).toHaveTextContent('2 days');
  });

  it('uses the singular form for a one-unit hold', () => {
    const { container } = renderRow(3600);
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).toHaveTextContent('1 hour');
  });

  it('rounds a partial unit up, never down', () => {
    const { container } = renderRow(5400);
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).toHaveTextContent('2 hours');
  });

  it('names the vault and links to the Perimeter page, visibly', () => {
    const { container } = renderRow(3600);
    const notice = container.querySelector(
      '[data-test-id="exit-delay-vault-notice"]',
    );
    expect(notice).toBeInTheDocument();
    expect(notice).toHaveTextContent(/Perimeter vault/i);
    const link = container.querySelector(
      '[data-test-id="exit-delay-vault-link"]',
    );
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/perimeter');
  });

  it('admits it could not check, instead of rendering as an unheld withdrawal', () => {
    // The delay fails closed on chain: a quote we could not read means the
    // withdrawal is held or it reverts. Rendering nothing would tell the user
    // the money arrives now.
    const { container } = renderRow(0, true);
    expect(container).not.toBeEmptyDOMElement();
    expect(
      container.querySelector('[data-layout-id="exit-delay-unknown"]'),
    ).toHaveTextContent('Could not be checked');
    const notice = container.querySelector(
      '[data-test-id="exit-delay-unknown-notice"]',
    );
    expect(notice).toHaveTextContent(/could not check/i);
    expect(notice).toHaveTextContent(/Perimeter vault/i);
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).not.toBeInTheDocument();
  });

  it('says it is still checking while the quote is in flight, instead of rendering as an unheld withdrawal', () => {
    const { container } = renderRow(0, false, true);
    expect(
      container.querySelector('[data-layout-id="exit-delay-checking"]'),
    ).toHaveTextContent(/Checking/);
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-delay-unknown"]'),
    ).not.toBeInTheDocument();
  });

  it('explains where the funds go, on click', () => {
    const { container } = renderRow(3600);
    const helper = container.querySelector(
      '[data-layout-id="exit-delay-helper"]',
    );
    expect(helper).toBeInTheDocument();
    fireEvent.click(helper!);
    expect(
      screen.getByText(/held in the Sovryn Perimeter vault/i),
    ).toBeInTheDocument();
  });
});
