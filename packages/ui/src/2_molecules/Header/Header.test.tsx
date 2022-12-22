import { render } from '@testing-library/react';

import React from 'react';

import Logo from '../../../assets/images/logo-sovryn.svg';
import { NavMenuItem } from '../NavMenuItem/NavMenuItem';
import { Header } from './Header';

describe('Header', () => {
  it('renders header', () => {
    const { getByRole } = render(<Header />);
    const header = getByRole('banner');
    expect(header).toBeDefined();
  });

  it('renders header with logo', () => {
    const { getAllByRole } = render(
      <Header logo={<img src={Logo} alt="logo" />} />,
    );
    expect(getAllByRole('img')).toBeDefined();
  });

  it('renders header with menu items', () => {
    const { getByText } = render(
      <Header menuItems={<NavMenuItem children="Zero" />} />,
    );
    expect(getByText('Zero')).toBeInTheDocument();
  });

  it('renders header with menu secondary content', () => {
    const { getByText } = render(
      <Header secondaryContent={<NavMenuItem children="Zero" />} />,
    );
    expect(getByText('Zero')).toBeInTheDocument();
  });
});
