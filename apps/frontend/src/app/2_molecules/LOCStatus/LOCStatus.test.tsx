import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

import { Decimal } from '@sovryn/utils';

import { i18n } from '../../../locales/i18n';
import { SURFACE_ZERO_CLAIM_SURPLUS } from '../../../utils/exitFee';
import { LOCStatus } from './LOCStatus';

/**
 * The surplus claim is a Zero exit like the others: charged a Perimeter fee
 * through Zero's own controller pointer, and held by the withdrawal delay when
 * it applies. The card shows both before the borrower presses Withdraw, and
 * does not offer Withdraw while the delay quote is still on its way.
 */

let mockFee: {
  active: boolean;
  rateBps: number;
  feeAmount: Decimal;
  netAmount: Decimal;
  loading: boolean;
  unknown: boolean;
};
let mockFeeGross: { toString(): string } | undefined;
let mockDelay: { delaySeconds: number; loading: boolean; unknown: boolean };
let mockDelaySurface: string | undefined;

jest.mock('nanoid', () => ({ nanoid: () => '1234' }));

jest.mock('../../../contexts/NotificationContext', () => ({
  useNotificationContext: () => ({ addNotification: jest.fn() }),
}));

jest.mock('../../../hooks/exitFee/useZeroClaimExitFee', () => ({
  useZeroClaimExitFee: (gross: { toString(): string }) => {
    mockFeeGross = gross;
    return mockFee;
  },
}));

jest.mock('../../../hooks/exitDelay/useZeroExitDelayQuote', () => ({
  useZeroExitDelayQuote: (surface: string) => {
    mockDelaySurface = surface;
    return mockDelay;
  },
}));

const NO_DELAY = { delaySeconds: 0, loading: false, unknown: false };

const renderStatus = (withdrawalSurplus = Decimal.from('0.4')) =>
  render(
    <MemoryRouter>
      <LOCStatus
        withdrawalSurplus={withdrawalSurplus}
        collateral={Decimal.ZERO}
        debt={Decimal.ZERO}
        onWithdraw={jest.fn()}
      />
    </MemoryRouter>,
  );

const withdrawButton = (container: HTMLElement) =>
  container.querySelector('[data-layout-id="zero-loc-surplus-withdraw"]');

describe('LOCStatus surplus claim', () => {
  beforeAll(async () => {
    await i18n;
  });

  beforeEach(() => {
    mockFee = {
      active: true,
      rateBps: 10,
      feeAmount: Decimal.from('0.0004'),
      netAmount: Decimal.from('0.3996'),
      loading: false,
      unknown: false,
    };
    mockFeeGross = undefined;
    mockDelay = NO_DELAY;
    mockDelaySurface = undefined;
  });

  describe('Perimeter fee', () => {
    it("shows the claim quote's net, marked approximate, with the fee in the tooltip", () => {
      const { container } = renderStatus();

      expect(mockFeeGross?.toString()).toBe('0.4');
      expect(screen.getByText(/0\.3996/)).toBeInTheDocument();
      expect(container.textContent).toContain('~');

      fireEvent.click(
        container.querySelector('[data-layout-id="exit-fee-helper"]')!,
      );
      expect(screen.getByText(/Perimeter fee \(0\.1%\)/)).toBeInTheDocument();
    });

    it('shows the gross surplus with no fee helper when no fee is charged', () => {
      mockFee = { ...mockFee, active: false, rateBps: 0 };

      const { container } = renderStatus();

      expect(screen.getByText('0.4 BTC')).toBeInTheDocument();
      expect(
        container.querySelector('[data-layout-id="exit-fee-helper"]'),
      ).not.toBeInTheDocument();
    });

    it('does not render the surplus stat at all when there is no surplus', () => {
      renderStatus(Decimal.ZERO);

      expect(screen.queryByText('withdrawal surplus')).not.toBeInTheDocument();
    });

    it('waits for the fee quote even once the delay has settled', () => {
      mockFee.loading = true;

      const { container } = renderStatus();

      expect(withdrawButton(container)).toBeDisabled();
    });

    it('offers Withdraw once the fee quote has settled', () => {
      mockFee.loading = false;

      const { container } = renderStatus();

      expect(withdrawButton(container)).toBeEnabled();
    });
  });

  describe('withdrawal delay', () => {
    it('quotes the delay for the claim surface', () => {
      renderStatus();

      expect(mockDelaySurface).toBe(SURFACE_ZERO_CLAIM_SURPLUS);
    });

    it('tells the borrower the claim will be held, and for how long', () => {
      mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

      const { container } = renderStatus();

      expect(screen.getByText('Withdrawal delay')).toBeInTheDocument();
      expect(screen.getByText('2 days')).toBeInTheDocument();
      expect(
        container.querySelector('[data-test-id="exit-delay-vault-notice"]'),
      ).toBeInTheDocument();
    });

    it('admits it could not check whether the claim will be held', () => {
      mockDelay = { delaySeconds: 0, loading: false, unknown: true };

      renderStatus();

      expect(screen.getByText('Could not be checked')).toBeInTheDocument();
    });

    it('waits for the delay quote before offering Withdraw, and says it is checking', () => {
      mockDelay = { delaySeconds: 0, loading: true, unknown: false };

      const { container } = renderStatus();

      expect(screen.getByText(/^Checking/)).toBeInTheDocument();
      expect(withdrawButton(container)).toBeDisabled();
    });

    it('offers Withdraw once a quote arrived', () => {
      mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

      const { container } = renderStatus();

      expect(withdrawButton(container)).toBeEnabled();
    });

    it('offers Withdraw when the quote could not be read', () => {
      mockDelay = { delaySeconds: 0, loading: false, unknown: true };

      const { container } = renderStatus();

      expect(withdrawButton(container)).toBeEnabled();
    });

    it('shows no delay row without a surplus to claim', () => {
      mockDelay = { delaySeconds: 172800, loading: false, unknown: false };

      renderStatus(Decimal.ZERO);

      expect(screen.queryByText('Withdrawal delay')).not.toBeInTheDocument();
    });
  });
});
