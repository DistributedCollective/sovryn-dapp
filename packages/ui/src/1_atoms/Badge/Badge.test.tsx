import { render, screen } from '@testing-library/react';

import React from 'react';

import { Badge } from './Badge';

test('renders Badge with action id', () => {
  render(<Badge content="99" dataActionId="sovryn-Badge" />);
  expect(
    screen.findAllByRole('span[data-action-id="sovryn-Badge"]'),
  ).toBeDefined();
});
