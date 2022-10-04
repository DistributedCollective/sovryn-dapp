import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Button } from './Button';

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

  // uncomment these test cases once Paragraph component will be merged (https://github.com/DistributedCollective/sovryn-dapp/pull/13)
  // it('should render a button size with a className equal to the large', () => {
  //   render(<Button text="Button size" size={ButtonSize.large} />);
  //   const classes = screen.getByText('Button size').getAttribute('class');
  //   expect(button).toContain('large');
  // });
  // it('should render a button style with a className equal to the secondary', () => {
  //   render(<Button text="Button style" style={ButtonStyle.secondary} />);
  //   const classes = screen.getByText('Button style').getAttribute('class');
  //   expect(button).toContain('secondary');
  // });
});
