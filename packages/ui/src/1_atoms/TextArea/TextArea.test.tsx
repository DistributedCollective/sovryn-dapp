import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import React, { createRef } from 'react';

import { TextArea } from './TextArea';

test('renders input and changes its value', () => {
  render(<TextArea value="basic" />);

  const input = screen.getByDisplayValue('basic') as HTMLTextAreaElement;
  expect(input.value).toBe('basic');

  fireEvent.change(input, { target: { value: 'I changed, ha!' } });
  expect(input.value).toBe('I changed, ha!');
});

test('renders readonly input and does not allow to change its value', () => {
  render(<TextArea value="readonly" readOnly={true} />);
  const input = screen.getByDisplayValue('readonly') as HTMLTextAreaElement;

  fireEvent.change(input, { target: { value: 'I changed, ha!' } });
  expect(input.value).toBe('readonly');
});

test('renders disabled input and does not allow to change its value', () => {
  render(<TextArea value="disabled" disabled={true} />);
  const input = screen.getByDisplayValue('disabled') as HTMLTextAreaElement;

  fireEvent.change(input, { target: { value: 'I changed, ha!' } });
  expect(input.value).toBe('disabled');
});

test('focus the input', () => {
  const ref = createRef<HTMLTextAreaElement>();
  render(<TextArea value="focus" ref={ref} />);
  waitFor(() => ref.current);
  ref.current?.focus();
  expect(document.activeElement).toBe(ref.current);
});
