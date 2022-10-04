import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { useCallback, useState } from 'react';

import { NavMenuItem } from './NavMenuItem';

const TestComponent = () => {
  const [selected, setSelected] = useState(false);
  const onClick = useCallback(() => setSelected(selected => !selected), []);
  return (
    <NavMenuItem children="Menu item" onClick={onClick} isActive={selected} />
  );
};

describe('NavMenuItem', () => {
  it('renders nav menu item', () => {
    const { getByText } = render(<NavMenuItem children="Menu item" />);
    expect(getByText('Menu item')).toBeInTheDocument();
  });

  it('should be active after click', () => {
    const { getByText } = render(<TestComponent />);
    userEvent.click(getByText('Menu item'));
    const classes = getByText('Menu item').getAttribute('class');
    expect(classes).toContain('active');
  });

  it('should show a count inside the Badge', () => {
    const { getByText } = render(
      <NavMenuItem children="Menu item" count={5} />,
    );
    expect(getByText('5')).toBeInTheDocument();
  });

  it('should show the maximum number which is 99 inside the Badge', () => {
    const { getByText } = render(
      <NavMenuItem children="Menu item" count={1000} />,
    );
    expect(getByText('99')).toBeInTheDocument();
  });
});
