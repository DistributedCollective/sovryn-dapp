import { render } from '@testing-library/react';

import React from 'react';

import { StatusItem } from './StatusItem';
import { StatusEnum } from './StatusItem.types';

test('renders status item', () => {
  const { getByText } = render(
    <StatusItem content="1" label="Label" status={StatusEnum.idle} />,
  );
  expect(getByText('Label')).toBeDefined();
});

test('renders success status item', () => {
  const { findAllByRole } = render(
    <StatusItem content="1" label="Label" status={StatusEnum.success} />,
  );
  expect(findAllByRole('svg[data-icon="success-icon"]')).toBeDefined();
});
