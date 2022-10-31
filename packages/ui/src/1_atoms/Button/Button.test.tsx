import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Button } from './Button';
import { ButtonSize, ButtonStyle } from './Button.types';

// import { ButtonSize, ButtonStyle } from './Button.types';
describe('Button', () => {
  it('renders a button', () => {
    render(<Button text="Button" />);
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('eventHandler called on click', () => {
    const handleClick = jest.fn();
    render(<Button text="Button" onClick={handleClick} />);
    const button = screen.getByText('Button');
    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button and prevent to click on it', () => {
    const handleClick = jest.fn();
    render(<Button text="Button" disabled onClick={handleClick} />);
    const button = screen.getByText('Button');
    userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  it('can be focused when using refs (button)', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button text="Button" ref={ref} />);
    waitFor(() => ref.current);
    ref.current?.focus();
    expect(document.activeElement).toEqual(ref.current);
  });

  it('can be focused when using refs (hyperlink)', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<Button text="Hyperlink" ref={ref} href="https://www.sovryn.app" />);
    waitFor(() => ref.current);
    ref.current?.focus();
    expect(document.activeElement).toEqual(ref.current);
  });

  it('should render a button size with a className equal to the large', () => {
    const { getByText } = render(
      <Button text="Button size" size={ButtonSize.large} />,
    );
    const classes = getByText('Button size').getAttribute('class');
    expect(classes).toContain('large');
  });

  it('should render a button style with a className equal to the secondary', () => {
    const { getByText } = render(
      <Button text="Button style" style={ButtonStyle.secondary} />,
    );
    const classes = getByText('Button style').getAttribute('class');
    expect(classes).toContain('secondary');
  });
});
