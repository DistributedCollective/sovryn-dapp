import { renderHook } from '@testing-library/react';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import 'jest-canvas-mock';

import { i18n } from '../../locales/i18n';
import { usePerimeterHoldToast } from './usePerimeterHoldToast';

/**
 * A held withdrawal does not arrive in the wallet, so a flow that reports only
 * success reads as money missing. The notice is the last thing standing between
 * that and the holder — including when the hold could not be read, where the
 * chain fails closed and the funds may well be in the vault.
 */

const mockAddNotification = jest.fn();

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: mockAddNotification }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

const notify = (quote: {
  delaySeconds: number;
  loading: boolean;
  unknown: boolean;
}) => {
  const { result } = renderHook(() => usePerimeterHoldToast(quote), {
    wrapper,
  });
  result.current();
  return mockAddNotification.mock.calls[0]?.[0];
};

describe('usePerimeterHoldToast', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('names the vault when the withdrawal was held', () => {
    const notification = notify({
      delaySeconds: 172800,
      loading: false,
      unknown: false,
    });

    expect(notification.title).toBe('Withdrawal held by the Sovryn Perimeter');
  });

  it('says it could not check, rather than staying silent', () => {
    const notification = notify({
      delaySeconds: 0,
      loading: false,
      unknown: true,
    });

    expect(notification.title).toBe(
      'Withdrawal may be held by the Sovryn Perimeter',
    );
  });

  it('stays silent when a quote arrived saying nothing is held', () => {
    notify({ delaySeconds: 0, loading: false, unknown: false });

    expect(mockAddNotification).not.toHaveBeenCalled();
  });

  it('stays silent while the quote has not arrived', () => {
    notify({ delaySeconds: 0, loading: true, unknown: true });

    expect(mockAddNotification).not.toHaveBeenCalled();
  });
});
