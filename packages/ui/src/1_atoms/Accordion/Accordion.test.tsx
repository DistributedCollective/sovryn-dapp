import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders accordion', () => {
    const { getByText } = render(
      <Accordion label="Test" dataLayoutId="accordion-simple">
        <div>Content</div>
      </Accordion>,
    );
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('calls eventHandler on click', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <Accordion
        label="Test (click to toggle)"
        dataLayoutId="accordion-simple"
        onClick={handleClick}
      >
        <div>Content</div>
      </Accordion>,
    );
    userEvent.click(getByTestId('accordion-simple'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows content on click', async () => {
    const handleClick = () => {
      render(
        <Accordion
          label="Test (click to toggle)"
          dataLayoutId="accordion-simple"
          open
        >
          <div data-layout-id="content-to-show">Content</div>
        </Accordion>,
      );
    };
    const { getByTestId } = render(
      <Accordion
        label="Test (click to toggle)"
        dataLayoutId="accordion-simple"
        onClick={handleClick}
      >
        <div data-layout-id="original-content">Content</div>
      </Accordion>,
    );
    userEvent.click(getByTestId('accordion-simple'));
    expect(getByTestId('content-to-show')).toBeInTheDocument();
  });

  it('renders disabled accordion and prevents clicks on it', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <Accordion
        label="Test (click to toggle)"
        dataLayoutId="accordion-simple"
        onClick={handleClick}
        disabled
      >
        <div>Content</div>
      </Accordion>,
    );
    userEvent.click(getByTestId('accordion-simple'));
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});
