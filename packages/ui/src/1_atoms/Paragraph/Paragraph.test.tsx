import { render, screen } from '@testing-library/react';

import React from 'react';

import { Paragraph } from './Paragraph';

describe('Test paragraphs', () => {
  test('renders a paragraph', () => {
    render(<Paragraph children="Testing paragraph" />);
    expect(screen.getByText(`Testing paragraph`)).toBeInTheDocument();
  });
});
