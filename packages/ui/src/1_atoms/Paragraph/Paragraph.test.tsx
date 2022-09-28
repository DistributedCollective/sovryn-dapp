import { render, screen } from '@testing-library/react';

import React from 'react';

import { Paragraph } from './Paragraph';
import {
  ParagraphSize,
  ParagraphStyle,
  ParagraphType,
} from './Paragraph.types';

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

  it('should render a paragraph size with a className equal to the extraLarge', () => {
    const size = ParagraphSize.extraLarge;
    render(<Paragraph children="Paragraph size" size={size} />);
    const paragraph = screen.getByText('Paragraph size').getAttribute('class');
    expect(paragraph).toContain('extraLarge');
  });

  it('should render a paragraph type with a className equal to the semibold', () => {
    const type = ParagraphType.semibold;
    render(<Paragraph children="Paragraph type" type={type} />);
    const paragraph = screen.getByText('Paragraph type').getAttribute('class');
    expect(paragraph).toContain('semibold');
  });

  it('should render a paragraph style with a className equal to the tall', () => {
    const style = ParagraphStyle.tall;
    render(<Paragraph children="Paragraph style" style={style} />);
    const paragraph = screen.getByText('Paragraph style').getAttribute('class');
    expect(paragraph).toContain('tall');
  });
});
