import { renderHook } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

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

    expect(notification.title).toBe(
      'Withdrawal delayed by the Sovryn Perimeter',
    );
  });

  it('says it could not check, rather than staying silent', () => {
    const notification = notify({
      delaySeconds: 0,
      loading: false,
      unknown: true,
    });

    expect(notification.title).toBe(
      'Withdrawal may be delayed by the Sovryn Perimeter',
    );
  });

  it('stays silent when a quote arrived saying nothing is held', () => {
    notify({ delaySeconds: 0, loading: false, unknown: false });

    expect(mockAddNotification).not.toHaveBeenCalled();
  });

  it('says the withdrawal may be held when the quote had not arrived', () => {
    // Silence is the notice's way of saying "paid now", which a quote that
    // never arrived cannot support.
    const notification = notify({
      delaySeconds: 0,
      loading: true,
      unknown: false,
    });

    expect(notification.title).toBe(
      'Withdrawal may be delayed by the Sovryn Perimeter',
    );
  });
});
