import { render } from '@testing-library/react';

import React from 'react';

import { Link } from './Link';

test('renders Link with action id', () => {
  const { getByTestId } = render(
    <Link
      text="sovryn-link"
      href="https://live.sovryn.app/"
      dataAttribute="sovryn-link"
    />,
  );
  expect(getByTestId('sovryn-link')).toBeDefined();
});

test('renders Link with href link', () => {
  const { getByText } = render(
    <Link text="sovryn-link" href="https://live.sovryn.app/" />,
  );
  const linkEl = getByText('sovryn-link');
  expect(linkEl).toHaveAttribute('href', 'https://live.sovryn.app/');
});
