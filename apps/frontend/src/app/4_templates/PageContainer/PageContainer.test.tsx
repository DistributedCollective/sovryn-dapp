import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import 'jest-canvas-mock';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';

import { useIsDappLocked } from '../../../hooks/maintenances/useIsDappLocked';
import { i18n } from '../../../locales/i18n';
import { PageContainer } from './PageContainer';

jest.mock('../../../hooks/maintenances/useIsDappLocked');
jest.mock('../../../hooks/useAccount', () => ({
  useAccount: () => ({ account: undefined }),
}));
jest.mock('../../../hooks/useChainStore', () => ({
  useCurrentChain: () => '0x1e',
}));
jest.mock('../../../config/chains', () => ({ RSK_CHAIN_ID: '0x1e' }));
jest.mock('../../3_organisms', () => ({
  Header: () => null,
  Footer: () => null,
}));
jest.mock(
  '../../5_pages/RewardsPage/components/Vesting/components/UnclaimedVestingAlert/UnclaimedVestingAlert',
  () => ({ UnclaimcedVestingAlert: () => null }),
);
jest.mock('../../2_molecules', () => ({ SovrynLogo: () => null }));
jest.mock('../../2_molecules/NetworkPicker/NetworkPicker', () => ({
  NetworkPicker: () => null,
}));

const mockedUseIsDappLocked = useIsDappLocked as jest.Mock;

const renderPage = (path: string, locked = true) => {
  mockedUseIsDappLocked.mockReturnValue(locked);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<PageContainer />}>
          <Route
            path="/bitocracy"
            element={
              <>
                <h1>Governance proposals</h1>
                <Link to="/convert">Convert</Link>
              </>
            }
          />
          <Route path="/bitocracy/:id" element={<h1>Governance proposal</h1>} />
          <Route path="*" element={<h1>Protocol activity</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

describe('PageContainer during maintenance', () => {
  beforeAll(async () => {
    await i18n;
  });

  it.each(['/bitocracy', '/bitocracy/', '/bitocracy?status=active'])(
    'keeps the governance list accessible at %s',
    path => {
      renderPage(path);
      expect(
        screen.getByRole('heading', { name: 'Governance proposals' }),
      ).toBeInTheDocument();
    },
  );

  it('keeps the proposal page accessible during maintenance', () => {
    renderPage('/bitocracy/owner-58');
    expect(
      screen.getByRole('heading', { name: 'Governance proposal' }),
    ).toBeInTheDocument();
  });

  it.each([
    '/',
    '/convert',
    '/borrow/fixed-interest',
    '/earn/staking',
    '/perimeter',
    '/bitocracy-other',
    '/bitocracy/owner-58/unexpected',
  ])('keeps the maintenance screen at %s', path => {
    renderPage(path);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bitocracy' })).toHaveAttribute(
      'href',
      '/bitocracy',
    );
  });

  it('opens governance from the maintenance screen', () => {
    renderPage('/');
    fireEvent.click(screen.getByRole('link', { name: 'Bitocracy' }));
    expect(
      screen.getByRole('heading', { name: 'Governance proposals' }),
    ).toBeInTheDocument();
  });

  it('restores the maintenance screen when leaving governance', () => {
    renderPage('/bitocracy');
    fireEvent.click(screen.getByRole('link', { name: 'Convert' }));
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bitocracy' })).toBeInTheDocument();
  });

  it('renders other pages normally outside maintenance', () => {
    renderPage('/convert', false);
    expect(
      screen.getByRole('heading', { name: 'Protocol activity' }),
    ).toBeInTheDocument();
  });
});
