import React, { useState } from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Overlay } from './Overlay';

type TestComponentSettings = {
  callback?: () => void;
};

const TestComponent = ({ callback }: TestComponentSettings) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeOverlay = () => {
    setIsOpen(false);
    if (callback) {
      callback();
    }
  };
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>open overlay</button>
      <Overlay isOpen={isOpen}>
        <div>
          <p>Are you sure?</p>
          <button onClick={closeOverlay}>Confirm</button>
        </div>
      </Overlay>
    </>
  );
};

describe('Overlay', () => {
  it('should show text when overlay is open', () => {
    const { getByText } = render(<Overlay isOpen>Overlay Active</Overlay>);
    expect(getByText('Overlay Active')).toBeInTheDocument();
  });

  it("should not find an overlay element when it's not open", () => {
    const { getByText } = render(
      <Overlay isOpen={false}>Overlay Active</Overlay>,
    );
    expect(() => getByText('Overlay Active')).toThrow();
  });

  it('should open overlay on button click', async () => {
    const { getByText } = render(<TestComponent />);
    userEvent.click(getByText('open overlay'));
    await waitFor(() => getByText('Confirm'));
    expect(getByText('Confirm')).toBeInTheDocument();
  });

  it('should open and close overlay on button click', async () => {
    const { getByText } = render(<TestComponent />);
    userEvent.click(getByText('open overlay'));
    await waitFor(() => getByText('Confirm'));
    expect(getByText('Confirm')).toBeInTheDocument();
    userEvent.click(getByText('Confirm'));
    expect(() => getByText('Confirm')).toThrow();
  });

  it('should switch focus away from button', async () => {
    const { getByText } = render(<TestComponent />);
    userEvent.click(getByText('open overlay'));
    await waitFor(() => getByText('Confirm'));
    const confirmButton = getByText('open overlay');
    expect(document.activeElement).not.toEqual(confirmButton);
  });
});
