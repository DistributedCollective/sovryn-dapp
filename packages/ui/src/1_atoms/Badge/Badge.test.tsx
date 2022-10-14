import { render, screen } from '@testing-library/react';

import React from 'react';

import { Badge } from './Badge';

test('renders Badge with action id', () => {
  render(<Badge content="99" dataLayoutId="sovryn-Badge" />);
  expect(
    screen.findAllByRole('span[data-layout-id="sovryn-Badge"]'),
  ).toBeDefined();
});
