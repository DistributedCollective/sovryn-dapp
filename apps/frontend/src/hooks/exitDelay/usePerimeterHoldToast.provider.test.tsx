import { act, fireEvent, render, screen } from '@testing-library/react';

import React, { FC, useEffect } from 'react';

import 'jest-canvas-mock';
import {
  MemoryRouter,
  RouterProvider,
  createHashRouter,
  createMemoryRouter,
  useLocation,
} from 'react-router-dom';

import { NotificationProvider } from '../../contexts/NotificationContext';
import { i18n } from '../../locales/i18n';
import { usePerimeterHoldToast } from './usePerimeterHoldToast';

/**
 * The notification provider draws its toasts above the Router, so nothing a
 * toast renders may need a Router ancestor: one that does throws while the
 * toast is drawn and takes the whole app down the moment a hold is confirmed.
 * These tests draw the toast through the real provider, with the Router only
 * around the component that raises it — the app's own arrangement.
 */

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

const HELD = { delaySeconds: 172800, loading: false, unknown: false };

const LINK = '[data-test-id="perimeter-hold-toast-link"]';

const Raiser: FC = () => {
  const notifyHold = usePerimeterHoldToast(HELD);
  useEffect(() => {
    notifyHold();
  }, [notifyHold]);
  return null;
};

const Location: FC = () => (
  <div data-test-id="location">{useLocation().pathname}</div>
);

const toastLink = () => document.querySelector(LINK) as HTMLAnchorElement;

const currentLocation = () =>
  document.querySelector('[data-test-id="location"]') as HTMLElement;

describe('usePerimeterHoldToast in the provider tree', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('draws the toast outside the Router and links to the Perimeter page', () => {
    render(
      <NotificationProvider>
        <MemoryRouter>
          <Raiser />
        </MemoryRouter>
      </NotificationProvider>,
    );

    expect(
      screen.getByText('Withdrawal delayed by the Sovryn Perimeter'),
    ).toBeInTheDocument();
    expect(toastLink()).toBeInTheDocument();
    expect(toastLink()).toHaveAttribute('href', '/perimeter');
  });

  it('names the withdraw queue in the toast text', () => {
    render(
      <NotificationProvider>
        <MemoryRouter>
          <Raiser />
        </MemoryRouter>
      </NotificationProvider>,
    );

    expect(
      screen.getByText(/went to the Sovryn Perimeter withdraw queue/),
    ).toBeInTheDocument();
  });

  it('opens the Perimeter page inside the app when the link is clicked', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <>
              <Raiser />
              <Location />
            </>
          ),
        },
        { path: '/perimeter', element: <Location /> },
      ],
      { initialEntries: ['/'] },
    );
    render(
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>,
    );
    expect(currentLocation()).toHaveTextContent('/');

    act(() => {
      fireEvent.click(toastLink());
    });

    expect(currentLocation()).toHaveTextContent('/perimeter');
  });

  it('leaves a modified click to the browser', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <>
              <Raiser />
              <Location />
            </>
          ),
        },
        { path: '/perimeter', element: <Location /> },
      ],
      { initialEntries: ['/'] },
    );
    render(
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>,
    );

    act(() => {
      fireEvent.click(toastLink(), { ctrlKey: true });
    });

    expect(currentLocation()).toHaveTextContent('/');
  });

  it('opens the Perimeter page inside a hash-routed build when the link is clicked', () => {
    window.location.hash = '';
    const router = createHashRouter([
      { path: '/', element: <Raiser /> },
      { path: '/perimeter', element: <Location /> },
    ]);
    render(
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>,
    );

    act(() => {
      fireEvent.click(toastLink());
    });

    expect(window.location.hash).toBe('#/perimeter');
    expect(currentLocation()).toHaveTextContent('/perimeter');
  });
});
