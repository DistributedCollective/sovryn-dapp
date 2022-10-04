import { render, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { useState } from 'react';

import { Dialog } from './Dialog';

type TestComponentSettings = {
  initialFocus?: string;
  callback?: () => void;
};

const TestComponent = ({ callback, initialFocus }: TestComponentSettings) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);
  const closeDialog = () => {
    setIsOpen(false);
    callback?.();
  };
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>open dialog</button>
      <button>outside</button>
      <Dialog
        isOpen={isOpen}
        initialFocusRef={initialFocus === 'button' ? ref : undefined}
        onClose={closeDialog}
      >
        <div>
          <p>Are you sure?</p>
          <button onClick={closeDialog}>Cancel</button>
          <button onClick={closeDialog} ref={ref}>
            Confirm
          </button>
        </div>
      </Dialog>
    </>
  );
};

describe('Dialog', () => {
  it('should show text when dialog is open', () => {
    const { getByText } = render(<Dialog isOpen>Dialog Active</Dialog>);
    expect(getByText('Dialog Active')).toBeInTheDocument();
  });

  it("should not find a dialog element when it's not open", () => {
    const { getByText } = render(<Dialog isOpen={false}>Dialog Active</Dialog>);
    expect(() => getByText('Dialog Active')).toThrow();
  });

  it('should open dialog on button click', async () => {
    const { getByText } = render(<TestComponent />);
    userEvent.click(getByText('open dialog'));
    await waitFor(() => getByText('Confirm'));
    expect(getByText('Confirm')).toBeInTheDocument();
  });

  it('should open and close dialog on button click', async () => {
    const { getByText } = render(<TestComponent />);
    userEvent.click(getByText('open dialog'));
    await waitFor(() => getByText('Confirm'));
    expect(getByText('Confirm')).toBeInTheDocument();
    userEvent.click(getByText('Confirm'));
    expect(() => getByText('Confirm')).toThrow();
  });

  it('should focus element passed into function', async () => {
    const { getByText } = render(<TestComponent initialFocus="button" />);
    await userEvent.click(getByText('open dialog'));
    await waitFor(() => getByText('Confirm'));
    const confirmButton = getByText('Confirm');
    expect(document.activeElement).toEqual(confirmButton);
  });

  it('should call function when user presses escape', async () => {
    const mockFunction = jest.fn();
    const { getByText, queryAllByText } = render(
      <TestComponent callback={mockFunction} initialFocus="button" />,
    );
    await userEvent.click(getByText('open dialog'));
    const domNode = getByText('Are you sure?');
    fireEvent.keyDown(domNode, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27,
    });
    expect(mockFunction).toHaveBeenCalledTimes(1);
    const cancelButtons = queryAllByText('Cancel');
    expect(cancelButtons).toHaveLength(0);
  });
});
