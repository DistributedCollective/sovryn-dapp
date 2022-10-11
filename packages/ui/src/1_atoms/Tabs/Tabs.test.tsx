import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Tabs } from './Tabs';

const items = [
  {
    label: '0',
    content: 'content-0',
  },
  {
    label: '1',
    content: 'content-1',
  },
  {
    label: 'disabled',
    content: 'disabled-content',
    disabled: true,
  },
];

describe('Tabs', () => {
  it('renders Tabs', () => {
    render(<Tabs items={items} index={1} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('content-1')).toBeInTheDocument();
  });

  it('switch between Tabs', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Tabs items={items} index={1} onChange={onChange} />,
    );

    userEvent.click(getByText('0'));

    expect(onChange).toBeCalledWith(0);
  });

  it('switch to disabled Tab', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Tabs items={items} index={1} onChange={onChange} />,
    );

    userEvent.click(getByText('disabled'));

    expect(onChange).not.toBeCalled();
  });
});
