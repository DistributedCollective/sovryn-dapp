import { render } from '@testing-library/react';

import React from 'react';

import { HealthBar } from './HealthBar';

describe('HealthBar', () => {
  it('renders a HealthBar', () => {
    const { getByTestId } = render(
      <HealthBar
        start={90}
        end={250}
        middleStart={110}
        middleEnd={150}
        value={200}
        dataLayoutId="health"
      />,
    );
    const healthBar = getByTestId('health');
    expect(healthBar).toBeInTheDocument();
  });

  it('renders a HealthBar range with correct size', () => {
    const { getByTestId } = render(
      <HealthBar
        start={90}
        end={250}
        middleStart={110}
        middleEnd={150}
        value={200}
        dataLayoutId="health"
      />,
    );
    const ranges = getByTestId('health').querySelectorAll('div');
    expect(ranges[0].style.flexBasis).toBe('20%');
    expect(ranges[1].style.flexBasis).toBe('40%');
    expect(ranges[2].style.flexBasis).toBe('100%');
  });
});
