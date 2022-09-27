import { render, screen } from '@testing-library/react';

import React from 'react';

import { Paragraph } from './Paragraph';

describe('Paragraph', () => {
  test('renders a paragraph', () => {
    render(<Paragraph children="Testing paragraph" />);
    expect(screen.getByText('Testing paragraph')).toBeInTheDocument();
  });

  test('check paragraph instance', () => {
    render(<Paragraph children="test" />);
    const paragraph = screen.getByText('test');
    expect(paragraph).toBeInstanceOf(HTMLParagraphElement);
  });
});
