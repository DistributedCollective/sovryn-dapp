import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

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

describe('ExitDelayRow', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('renders nothing when the perimeter imposes no delay', () => {
    const { container } = render(<ExitDelayRow delaySeconds={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the hold duration in whole units', () => {
    const { container } = render(<ExitDelayRow delaySeconds={172800} />);
    expect(screen.getByText('Withdrawal hold')).toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).toHaveTextContent('2 days');
  });

  it('uses the singular form for a one-unit hold', () => {
    const { container } = render(<ExitDelayRow delaySeconds={3600} />);
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).toHaveTextContent('1 hour');
  });

  it('rounds a partial unit up, never down', () => {
    const { container } = render(<ExitDelayRow delaySeconds={5400} />);
    expect(
      container.querySelector('[data-layout-id="exit-delay-duration"]'),
    ).toHaveTextContent('2 hours');
  });

  it('explains where the funds go, on click', () => {
    const { container } = render(<ExitDelayRow delaySeconds={3600} />);
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
