import { screen, render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { createRef } from 'react';

import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  test('renders a dropdown', () => {
    const data = <div>Change text</div>;
    render(<Dropdown text="Dropdown" children={data} />);

    const dropdown = screen.getByRole('button');
    expect(dropdown).toHaveTextContent('Dropdown');
  });

  test('renders an open dropdown', () => {
    const data = <div>Option</div>;
    const { getByText } = render(<Dropdown text="Dropdown" children={data} />);
    userEvent.click(getByText('Dropdown'));
    const dropdownOption = screen.queryByText('Option');
    expect(dropdownOption).toBeInTheDocument();
  });

  test('should close dropdown after click outside', () => {
    const data = <div>Option</div>;
    const { getByText } = render(<Dropdown text="Dropdown" children={data} />);
    userEvent.click(getByText('Dropdown'));
    userEvent.click(document.body);
    const dropdownOption = screen.queryByText('Option');
    expect(dropdownOption).not.toBeInTheDocument();
  });

  test('should open dropdown programically', () => {
    const data = <div>Option</div>;
    const ref = createRef<HTMLButtonElement>();
    const { getByText } = render(<Dropdown ref={ref} text="Dropdown" children={data} />);
    waitFor(() => ref.current);
    act(() => ref.current?.click());
    const dropdownOption = screen.queryByText('Option');
    expect(dropdownOption).toBeInTheDocument();
  });
});
