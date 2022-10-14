import { render, screen } from '@testing-library/react';

import React from 'react';

import { Link } from './Link';

test('renders Link with action id', () => {
  render(
    <Link
      text="sovryn-link"
      href="https://live.sovryn.app/"
      dataLayoutId="sovryn-link"
    />,
  );
  expect(screen.findAllByRole('a[data-layout-id="sovryn-link"]')).toBeDefined();
});

test('renders Link with href link', () => {
  render(<Link text="sovryn-link" href="https://live.sovryn.app/" />);
  const linkEl = screen.getByText('sovryn-link');
  expect(linkEl).toHaveAttribute('href', 'https://live.sovryn.app/');
});
