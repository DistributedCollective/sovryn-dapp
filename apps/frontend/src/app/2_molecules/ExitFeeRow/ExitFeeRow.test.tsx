import { render, screen, fireEvent } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../locales/i18n';
import { ExitFeeRow } from './ExitFeeRow';

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

describe('ExitFeeRow', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('renders a single row with the net amount when the fee is active', () => {
    const { container } = render(
      <ExitFeeRow
        gross={Decimal.from(100)}
        rateBps={50}
        active
        assetSymbol="DLLR"
      />,
    );
    expect(screen.getByText('You will receive')).toBeInTheDocument();
    // "Perimeter fee" only lives inside the (closed) tooltip, not as a row label.
    expect(screen.queryByText(/^Perimeter fee/)).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-layout-id="exit-fee-net"]'),
    ).toHaveTextContent('99.5');
  });

  it('shows the fee amount and disclaimer inside the tooltip on click', () => {
    const { container } = render(
      <ExitFeeRow
        gross={Decimal.from(100)}
        rateBps={50}
        active
        assetSymbol="DLLR"
      />,
    );

    const helperIcon = container.querySelector(
      '[data-layout-id="exit-fee-helper"]',
    );
    expect(helperIcon).toBeInTheDocument();
    // tooltip content is not rendered until the trigger is clicked
    expect(
      screen.queryByText(/Perimeter fee \(0\.5%\)/),
    ).not.toBeInTheDocument();

    fireEvent.click(helperIcon as Element);

    expect(screen.getByText(/Perimeter fee \(0\.5%\)/)).toBeInTheDocument();
    expect(
      screen.getByText(
        /The perimeter fee is deducted from the withdrawn amount/,
      ),
    ).toBeInTheDocument();
  });

  it.each([
    ['inactive', false, 50, '100'],
    ['zero rate', true, 0, '100'],
    ['insane rate', true, 10001, '100'],
    ['zero gross', true, 50, '0'],
  ])('renders nothing when %s', (_label, active, rateBps, gross) => {
    const { container } = render(
      <ExitFeeRow
        gross={Decimal.from(gross)}
        rateBps={rateBps as number}
        active={active as boolean}
        assetSymbol="DLLR"
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
