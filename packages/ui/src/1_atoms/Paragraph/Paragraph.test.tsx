import { render, screen } from '@testing-library/react';

import React from 'react';

import { Paragraph } from './Paragraph';
import { ParagraphSize, ParagraphStyle } from './Paragraph.types';

describe('Paragraph', () => {
  it('renders a paragraph', () => {
    render(<Paragraph children="Testing paragraph" />);
    expect(screen.getByText('Testing paragraph')).toBeInTheDocument();
  });

  it('check paragraph instance', () => {
    render(<Paragraph children="test" />);
    const paragraph = screen.getByText('test');
    expect(paragraph).toBeInstanceOf(HTMLParagraphElement);
  });

  it('should render a paragraph size with a className equal to the base', () => {
    render(<Paragraph children="Paragraph size" size={ParagraphSize.base} />);
    const classes = screen.getByText('Paragraph size').getAttribute('class');
    expect(classes).toContain('base');
  });

  it('should render a paragraph style with a className equal to the tall', () => {
    render(
      <Paragraph children="Paragraph style" style={ParagraphStyle.tall} />,
    );
    const classes = screen.getByText('Paragraph style').getAttribute('class');
    expect(classes).toContain('tall');
  });
});
