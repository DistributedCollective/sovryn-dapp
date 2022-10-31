import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Tooltip } from './Tooltip';
import { TooltipPlacement, TooltipTrigger } from './Tooltip.types';

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render a tooltip on hover in and hide on hover out', () => {
    const { getByRole, queryByText } = render(
      <Tooltip children={<button>Text</button>} content={<>Tooltip</>} />,
    );
    const button = getByRole('button');
    userEvent.hover(button);
    const tooltip = queryByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
    userEvent.unhover(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should render a tooltip with data attribute', () => {
    const { getByTestId } = render(
      <Tooltip
        children={<button>Text</button>}
        content={<>Tooltip</>}
        dataLayoutId="tooltip-storybook-id"
      />,
    );
    const tooltip = getByTestId('tooltip-storybook-id');
    expect(tooltip).toBeInTheDocument();
  });

  it('should render a tooltip on focus in and hide on focus out', async () => {
    const { getByRole, queryByText } = render(
      <Tooltip
        trigger={TooltipTrigger.focus}
        children={<button>Text</button>}
        content={<>Tooltip</>}
      />,
    );
    const button = getByRole('button');
    await waitFor(() => button.focus());
    const tooltip = queryByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
    await waitFor(() => button.blur());
    act(() => {
      jest.runAllTimers();
    });
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should render a tooltip on click and hide on a second click', () => {
    const { getByRole, queryByText } = render(
      <Tooltip
        trigger={TooltipTrigger.click}
        children={<button>Text</button>}
        content={<>Tooltip</>}
      />,
    );
    const button = getByRole('button');
    userEvent.click(button);
    const tooltip = queryByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
    userEvent.click(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should not render a tooltip if disabled is true', () => {
    const { getByRole, queryByText } = render(
      <Tooltip
        disabled
        children={<button>Text</button>}
        content={<>Tooltip</>}
      />,
    );
    userEvent.click(getByRole('button'));
    expect(queryByText('Tooltip')).not.toBeInTheDocument();
  });

  it('should render a tooltip with a bottom placement', () => {
    const { getByRole, getByText } = render(
      <Tooltip
        children={<button>Text</button>}
        placement={TooltipPlacement.bottom}
        content={<>Tooltip</>}
      />,
    );
    userEvent.hover(getByRole('button'));
    const tooltip = getByText('Tooltip');
    const classes = tooltip.getAttribute('class');
    expect(classes).toContain('bottom');
  });
});
