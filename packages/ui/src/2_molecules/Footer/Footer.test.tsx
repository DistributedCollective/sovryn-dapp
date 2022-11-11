import { render } from '@testing-library/react';

import React from 'react';

import { Link } from '../../1_atoms';
import Logo from '../../../assets/images/logo-sovryn.svg';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders footer', () => {
    const { getByRole } = render(<Footer />);
    const header = getByRole('contentinfo');
    expect(header).toBeDefined();
  });

  it('renders footer with left content', () => {
    const { getByRole } = render(
      <Footer leftContent={<img src={Logo} alt="logo" />} />,
    );
    expect(getByRole('img')).toBeDefined();
  });

  it('renders footer with right content', () => {
    const { getByText } = render(
      <Footer rightContent={<Link href="/zero" text="Zero" />} />,
    );
    expect(getByText('Zero')).toBeInTheDocument();
  });

  it('renders footer with link', () => {
    const { getByText } = render(
      <Footer links={<Link href="/zero" text="Zero" />} />,
    );
    expect(getByText('Zero')).toBeInTheDocument();
  });
});
