import { fireEvent, render, screen } from '@testing-library/react';

import React from 'react';

import { Button } from './Button';
import { ButtonSize, ButtonStyle } from './Button.types';

describe('Button', () => {
  it('renders a button', () => {
    render(<Button text="Button" />);
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('eventHandler called on click', () => {
    const handleClick = jest.fn();
    render(<Button text="Button" onClick={handleClick} />);
    const button = screen.getByText('Button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button and prevent to click on it', () => {
    const handleClick = jest.fn();
    render(<Button text="Button" disabled onClick={handleClick} />);
    const button = screen.getByText('Button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  // uncomment these test cases once Paragraph component will be merged (https://github.com/DistributedCollective/sovryn-dapp/pull/13)
  // it('should render a button size with a className equal to the large', () => {
  //   const size = ButtonSize.large;
  //   render(<Button text="Button size" size={size} />);
  //   const button = screen.getByText('Button size').getAttribute('class');
  //   expect(button).toContain('large');
  // });

  // it('should render a button style with a className equal to the secondary', () => {
  //   const style = ButtonStyle.secondary;
  //   render(<Button text="Button style" style={style} />);
  //   const button = screen.getByText('Button style').getAttribute('class');
  //   expect(button).toContain('secondary');
  // });
});
