import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
  it('renders radio button and allow to set checked', () => {
    const { getByLabelText } = render(
      <RadioButton id="radioButton" label="Radio button" />,
    );
    expect(getByLabelText('Radio button')).not.toBeChecked();
    const radioButton: HTMLElement = getByLabelText('Radio button');
    userEvent.click(radioButton);
    expect(getByLabelText('Radio button')).toBeChecked();
  });

  it('renders disabled radio button and does not allow to set checked', () => {
    const { getByLabelText } = render(
      <RadioButton id="radioButton" disabled label="Radio button" />,
    );
    expect(getByLabelText('Radio button')).not.toBeChecked();
    const radioButton: HTMLElement = getByLabelText('Radio button');
    userEvent.click(radioButton);
    expect(getByLabelText('Radio button')).not.toBeChecked();
  });
});
