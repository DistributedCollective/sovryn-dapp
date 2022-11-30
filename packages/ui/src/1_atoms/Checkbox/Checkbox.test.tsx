import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { FC } from 'react';

import { Checkbox, CheckboxProps } from './Checkbox';

const Component: FC<CheckboxProps> = props => {
  const [checked, toggleChecked] = React.useReducer(value => !value, false);
  return (
    <Checkbox
      {...props}
      checked={checked}
      onChangeValue={toggleChecked}
      label="Checkbox"
    />
  );
};

describe('Checkbox', () => {
  it('has a checkbox input', () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector('input[type=checkbox]')).toBeInTheDocument();
  });

  it('renders checkbox label', () => {
    const { getByText } = render(<Checkbox label="Click me" />);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('does not have checked state', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('has checked state', () => {
    const { container } = render(<Checkbox checked />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('does not have indeterminate state', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.indeterminate).toBe(false);
  });

  it('has indeterminate state', () => {
    const { container } = render(<Checkbox indeterminate />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });

  it('does not have disabled state', () => {
    const { container } = render(<Checkbox />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  it('has disabled state', () => {
    const { container } = render(<Checkbox disabled />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('triggers onChange callback when clicked', () => {
    const mockFunction = jest.fn();
    const { container } = render(<Checkbox onChange={mockFunction} />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    userEvent.click(input);
    expect(mockFunction).toBeCalledTimes(1);
  });

  it('triggers onChangeValue callback when clicked', () => {
    const mockFunction = jest.fn();
    const { container } = render(<Checkbox onChangeValue={mockFunction} />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    userEvent.click(input);
    expect(mockFunction).toBeCalledTimes(1);
  });

  it('changes checked state on click', () => {
    const { container } = render(<Component />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(false);
    userEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it('does not change state for disabled checkbox', () => {
    const { container } = render(<Component disabled />);
    const input = container.querySelector(
      'input[type=checkbox]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(false);
    userEvent.click(input);
    expect(input.checked).toBe(false);
  });
});
