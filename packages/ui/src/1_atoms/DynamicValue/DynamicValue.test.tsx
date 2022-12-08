import { render } from '@testing-library/react';

import React from 'react';

import { DynamicValue } from './DynamicValue';

describe('DynamicValue', () => {
  it('has text-gray-30 class as default', () => {
    const { container } = render(<DynamicValue initialValue={0} value={0} />);
    expect(container.querySelector('div')).toHaveClass('text-gray-30');
  });

  it('has text-primary-10 class when value is changed', () => {
    const { container } = render(<DynamicValue initialValue={0} value={1} />);
    expect(container.querySelector('div')).toHaveClass('text-primary-10');
  });

  it('has text-gray-10 class and loading icon when pending', () => {
    const { container } = render(
      <DynamicValue initialValue={0} value={1} loading />,
    );
    expect(container.querySelector('div')).toHaveClass('text-gray-10');
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('overrides value using renderer', () => {
    const { container, getByText } = render(
      <DynamicValue
        initialValue={0}
        value={0}
        renderer={value => <span>x-{value}-x</span>}
      />,
    );
    expect(getByText('x-0-x')).toBeInTheDocument();
    expect(container.querySelector('span')).toBeInTheDocument();
  });
});
