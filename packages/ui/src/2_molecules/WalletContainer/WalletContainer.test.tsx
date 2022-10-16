import { render } from '@testing-library/react';

import React from 'react';

import { Icon } from '../../1_atoms/Icon/Icon';
import { WalletContainer } from './WalletContainer';

describe('WalletContainer', () => {
  it('should render a component', () => {
    const { getByText } = render(<WalletContainer name="Ledger" />);
    expect(getByText('Ledger')).toBeInTheDocument();
  });

  it('should render a component with icon', () => {
    const { findByRole } = render(
      <WalletContainer name="Ledger" icon={<Icon icon="ledger" />} />,
    );
    expect(findByRole('svg[data-icon="ledger"]')).toBeDefined();
  });
});
