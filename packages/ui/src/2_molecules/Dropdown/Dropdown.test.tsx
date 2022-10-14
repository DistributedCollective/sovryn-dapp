import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { createRef } from 'react';

import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  test('renders a dropdown', () => {
    const data = <div>Change text</div>;
    const { getByRole } = render(<Dropdown text="Dropdown" children={data} />);

    const dropdown = getByRole('button');
    expect(dropdown).toHaveTextContent('Dropdown');
  });

  test('renders an open dropdown', () => {
    const data = <div>Option</div>;
    const { getByText, queryByText } = render(
      <Dropdown text="Dropdown" children={data} />,
    );
    userEvent.click(getByText('Dropdown'));
    const dropdownOption = queryByText('Option');
    expect(dropdownOption).toBeInTheDocument();
  });

  test('should close dropdown after click outside', () => {
    const data = <div>Option</div>;
    const { getByText, queryByText } = render(
      <Dropdown text="Dropdown" children={data} />,
    );
    userEvent.click(getByText('Dropdown'));
    userEvent.click(document.body);
    const dropdownOption = queryByText('Option');
    expect(dropdownOption).not.toBeInTheDocument();
  });

  test('should open dropdown programically', () => {
    const data = <div>Option</div>;
    const ref = createRef<HTMLButtonElement>();
    const { queryByText } = render(
      <Dropdown ref={ref} text="Dropdown" children={data} />,
    );
    waitFor(() => ref.current);
    act(() => ref.current?.click());
    const dropdownOption = queryByText('Option');
    expect(dropdownOption).toBeInTheDocument();
  });
});
