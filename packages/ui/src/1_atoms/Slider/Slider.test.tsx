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

  it('applies the rangeSlider class when isSimple is false', () => {
    const { container } = render(<Slider isSimple={false} />);
    const slider = container.firstChild;
    expect(slider).toHaveClass('rangeSlider');
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

  it('renders correctly range slider and custom class names', () => {
    const { container } = render(
      <Slider
        isSimple={false}
        thumbClassName="custom-thumb"
        trackClassName="custom-track"
      />,
    );

    const slider = container.firstChild;
    expect(slider).toHaveClass('rangeSlider');

    const thumb = container.querySelector('.thumb');
    const track = container.querySelector('.track');

    expect(thumb).toHaveClass('custom-thumb');
    expect(track).toHaveClass('custom-track');
  });
});
