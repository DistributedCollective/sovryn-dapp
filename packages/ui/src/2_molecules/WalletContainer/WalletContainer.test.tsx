import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Icon } from '../../1_atoms/Icon/Icon';
import { WalletContainer } from './WalletContainer';

describe('WalletContainer', () => {
  it('should render a component', () => {
    const { getByText } = render(<WalletContainer name="Ledger" />);
    expect(getByText('Ledger')).toBeInTheDocument();
  });

  it('should render a component with an icon', () => {
    const { findByRole } = render(
      <WalletContainer name="Ledger" icon={<Icon icon="info" />} />,
    );
    expect(findByRole('svg[data-icon="info"]')).toBeDefined();
  });

  it('eventHandler called on click', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <WalletContainer
        name="Ledger"
        icon={<Icon icon="info" />}
        onClick={handleClick}
      />,
    );
    userEvent.click(getByText('Ledger'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be focused when using refs (button)', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <WalletContainer name="Ledger" icon={<Icon icon="info" />} ref={ref} />,
    );
    waitFor(() => ref.current);
    ref.current?.focus();
    expect(document.activeElement).toEqual(ref.current);
  });
});
