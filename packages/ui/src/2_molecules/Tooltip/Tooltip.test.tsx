import { act, screen, render, waitFor } from '@testing-library/react';
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

  test('should render a tooltip on hover in and hide on hover out', () => {
    render(<Tooltip children={<button>Text</button>} content={<>Tooltip</>} />);
    const button = screen.getByRole('button');
    userEvent.hover(button);
    const tooltip = screen.queryByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
    userEvent.unhover(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should render a tooltip on focus in and hide on focus out', async () => {
    render(
      <Tooltip
        trigger={TooltipTrigger.focus}
        children={<button>Text</button>}
        content={<>Tooltip</>}
      />,
    );
    const button = screen.getByRole('button');
    await waitFor(() => button.focus());
    const tooltip = screen.queryByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
    await waitFor(() => button.blur());
    act(() => {
      jest.runAllTimers();
    });
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should render a tooltip on click and hide on a second click', () => {
    render(
      <Tooltip
        trigger={TooltipTrigger.click}
        children={<button>Text</button>}
        content={<>Tooltip</>}
      />,
    );
    const button = screen.getByRole('button');
    userEvent.click(button);
    const tooltip = screen.queryByText('Tooltip');
    expect(tooltip).toBeInTheDocument();
    userEvent.click(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(tooltip).not.toBeInTheDocument();
  });

  it('should not render a tooltip if disabled is true', () => {
    render(
      <Tooltip
        disabled
        children={<button>Text</button>}
        content={<>Tooltip</>}
      />,
    );
    userEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Tooltip')).not.toBeInTheDocument();
  });

  it('should render a tooltip with a bottom placement', () => {
    render(
      <Tooltip
        children={<button>Text</button>}
        placement={TooltipPlacement.BOTTOM}
        content={<>Tooltip</>}
      />,
    );
    userEvent.hover(screen.getByRole('button'));
    const tooltip = screen.getByText('Tooltip');
    const classes = tooltip.getAttribute('class');
    expect(classes).toContain('bottom');
  });
});
