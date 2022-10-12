import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';

import { Input } from './Input';

test('renders input and changes its value', () => {
  render(<Input value="basic" />);

  const input = screen.getByDisplayValue('basic') as HTMLInputElement;
  expect(input.value).toBe('basic');

  fireEvent.change(input, { target: { value: 'I changed, ha!' } });
  expect(input.value).toBe('I changed, ha!');
});

test('renders readonly input and does not allow to change its value', () => {
  render(<Input value="readonly" readOnly={true} />);
  const input = screen.getByDisplayValue('readonly') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'I changed, ha!' } });
  expect(input.value).toBe('readonly');
});

test('renders disabled input and does not allow to change its value', () => {
  render(<Input value="disabled" disabled={true} />);
  const input = screen.getByDisplayValue('disabled') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'I changed, ha!' } });
  expect(input.value).toBe('disabled');
});

test('renders numeric input and does not allow to enter non-numeric values', () => {
  render(<Input value="12" type="number" />);
  const input = screen.getByDisplayValue('12') as HTMLInputElement;

  fireEvent.change(input, { target: { value: 'Non-numeric value' } });
  expect(input.value).toBe('');

  fireEvent.change(input, { target: { value: '56' } });
  expect(input.value).toBe('56');
});

test('focus the input', () => {
  const ref = createRef<HTMLInputElement>();
  render(<Input value="focus" ref={ref} />);
  waitFor(() => ref.current);
  ref.current?.focus();
  expect(document.activeElement).toBe(ref.current);
});
