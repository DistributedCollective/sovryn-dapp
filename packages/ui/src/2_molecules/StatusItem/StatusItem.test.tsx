import { render } from '@testing-library/react';

import React from 'react';

import { StatusItem } from './StatusItem';
import { StatusType } from './StatusItem.types';

describe('StatusItem', () => {
  it('renders status item', () => {
    const { getByText } = render(
      <StatusItem content="1" label="Label" status={StatusType.idle} />,
    );
    expect(getByText('Label')).toBeDefined();
  });

  it('renders success status item', () => {
    const { findAllByRole } = render(
      <StatusItem content="1" label="Label" status={StatusType.success} />,
    );
    expect(findAllByRole('svg[data-icon="success-icon"]')).toBeDefined();
  });
});
