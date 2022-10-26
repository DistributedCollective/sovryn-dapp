import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { RadioButtonGroup } from './RadioButtonGroup';

const options = [
  {
    label: 'Custom amount',
    name: 'settings',
  },
  {
    label: 'Unlimited amount',
    name: 'settings',
  },
];

describe('RadioButtonGroup', () => {
  it('renders radio button group', () => {
    const { getByLabelText } = render(
      <RadioButtonGroup label="Group" options={options} />,
    );
    expect(getByLabelText('Custom amount')).toBeInTheDocument();
    expect(getByLabelText('Unlimited amount')).toBeInTheDocument();
  });

  it('renders radio button group with first checked radio button by default', () => {
    const { getByLabelText } = render(
      <RadioButtonGroup label="Group" options={options} />,
    );
    expect(getByLabelText('Custom amount')).toBeChecked();
  });

  it('should change the default radio button', () => {
    const { getByLabelText } = render(
      <RadioButtonGroup label="Group" options={options} />,
    );
    const label = getByLabelText('Unlimited amount');
    userEvent.click(label);
    expect(label).toBeChecked();
  });
});
