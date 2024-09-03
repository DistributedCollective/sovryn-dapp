import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';

import React from 'react';

import { Slider } from './Slider';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Slider', () => {
  it('renders the slider with default props', () => {
    render(<Slider />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });

  it('applies the isDouble class when isDouble is true', () => {
    const { container } = render(<Slider isDouble />);
    const slider = container.firstChild;
    expect(slider).toHaveClass('isDouble');
  });

  it('applies custom class names to thumbs and tracks', () => {
    const { container } = render(
      <Slider thumbClassName="custom-thumb" trackClassName="custom-track" />,
    );

    const thumb = container.querySelector('.thumb');
    const track = container.querySelector('.track');

    expect(thumb).toHaveClass('custom-thumb');
    expect(track).toHaveClass('custom-track');
  });

  it('renders correctly with isDouble and custom class names', () => {
    const { container } = render(
      <Slider
        isDouble
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
      />,
    );

    const slider = container.firstChild;
    expect(slider).toHaveClass('isDouble');

    const thumb = container.querySelector('.thumb');
    const track = container.querySelector('.track');

    expect(thumb).toHaveClass('custom-thumb');
    expect(track).toHaveClass('custom-track');
  });
});
