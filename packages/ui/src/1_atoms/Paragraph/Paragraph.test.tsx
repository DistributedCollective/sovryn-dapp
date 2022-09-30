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

  it('should render a paragraph size with a className equal to the base', () => {
    render(<Paragraph children="Paragraph size" size={ParagraphSize.base} />);
    const paragraphClasses = screen
      .getByText('Paragraph size')
      .getAttribute('class');
    expect(paragraphClasses).toContain('base');
  });

  it('should render a paragraph type with a className equal to the regular', () => {
    render(
      <Paragraph children="Paragraph type" type={ParagraphType.regular} />,
    );
    const paragraphClasses = screen
      .getByText('Paragraph type')
      .getAttribute('class');
    expect(paragraphClasses).toContain('regular');
  });

  it('should render a paragraph style with a className equal to the tall', () => {
    render(
      <Paragraph children="Paragraph style" style={ParagraphStyle.tall} />,
    );
    const paragraphClasses = screen
      .getByText('Paragraph style')
      .getAttribute('class');
    expect(paragraphClasses).toContain('tall');
  });
});
