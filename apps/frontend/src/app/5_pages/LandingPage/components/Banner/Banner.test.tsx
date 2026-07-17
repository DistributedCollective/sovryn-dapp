import { render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { MemoryRouter } from 'react-router-dom';

import { i18n } from '../../../../../locales/i18n';
import { Banner } from './Banner';

jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('Banner', () => {
  beforeAll(async () => {
    await i18n;
  });

  it('renders the USDT0 migration promo card first with CTA to market making', () => {
    render(<Banner />, { wrapper: MemoryRouter });

    expect(screen.getByText('USDT0 MIGRATION: ~10% APR')).toBeInTheDocument();

    const cta = screen.getByText('Start migration');
    expect(cta.closest('a')).toHaveAttribute('href', '/earn/market-making');
  });

  it('still renders the zero interest loans promo card', () => {
    render(<Banner />, { wrapper: MemoryRouter });

    expect(screen.getByText('0% INTEREST LOANS')).toBeInTheDocument();
  });
});
