import { render, screen } from '@testing-library/react';

import React from 'react';

import { Heading } from './Heading';
import { HeadingType } from './Heading.types';

describe('Heading', () => {
  it('renders a Heading H1', () => {
    render(<Heading children="h1" type={HeadingType.h1} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
  });

  it('renders a Heading H2', () => {
    render(<Heading children="h2" type={HeadingType.h2} />);
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toBeInTheDocument();
  });

  it('renders a Heading H3', () => {
    render(<Heading children="h3" type={HeadingType.h3} />);
    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toBeInTheDocument();
  });
});
