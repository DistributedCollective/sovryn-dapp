import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { ContextLink } from './ContextLink';

describe('ContextLink', () => {
  it('should render children and show tooltip on click', () => {
    const { getByText } = render(
      <ContextLink tooltipContent="Tooltip">Link</ContextLink>,
    );
    const link = getByText('Link');
    userEvent.click(link);
    const tooltip = getByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
  });

  it('should render tooltip with a custom class', () => {
    const { getByText } = render(
      <ContextLink tooltipContent="Tooltip" className="custom-class">
        Link
      </ContextLink>,
    );
    const link = getByText('Link');
    const classes = link.getAttribute('class');
    expect(classes).toContain('custom-class');
  });

  it('should render tooltip with a data attribute', () => {
    const { getByText, getByTestId } = render(
      <ContextLink tooltipContent="Tooltip" dataAttribute="tooltip-data">
        Link
      </ContextLink>,
    );
    const link = getByText('Link');
    userEvent.hover(link);
    const tooltip = getByTestId('tooltip-data');
    expect(tooltip).toBeInTheDocument();
  });
});
