import { render } from '@testing-library/react';

import React from 'react';

import { Badge } from './Badge';

test('renders Badge with action id', () => {
  const { getByTestId } = render(
    <Badge content="99" dataLayoutId="sovryn-badge" />,
  );
  expect(getByTestId('sovryn-badge')).toBeDefined();
});

test('renders Badge with the right content', () => {
  const { getByTestId } = render(
    <Badge content="99" dataLayoutId="sovryn-badge" />,
  );
  const { textContent } = getByTestId('sovryn-badge');
  expect(textContent).toBe('99');
});
