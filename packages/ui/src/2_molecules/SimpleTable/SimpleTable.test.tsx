import { render } from '@testing-library/react';

import React from 'react';

import { SimpleTable } from './SimpleTable';
import { SimpleTableRow } from './components/SimpleTableRow/SimpleTableRow';

test('renders simple table', () => {
  const { getByTestId, getByText } = render(
    <SimpleTable dataLayoutId="table">
      <SimpleTableRow label="label" value="value" />
    </SimpleTable>,
  );
  expect(getByTestId('table')).toBeDefined();
  expect(getByText('label')).toBeDefined();
  expect(getByText('value')).toBeDefined();
});
