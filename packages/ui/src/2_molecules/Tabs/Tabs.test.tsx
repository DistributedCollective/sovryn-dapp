import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React from 'react';

import { Tabs } from './Tabs';

const items = [
  {
    label: '0',
    content: 'content-0',
    dataAttribute: 'tab-0',
  },
  {
    label: '1',
    content: 'content-1',
    dataAttribute: 'tab-1',
  },
  {
    label: 'disabled',
    content: 'disabled-content',
    disabled: true,
    dataAttribute: 'tab-disabled',
  },
];

describe('Tabs', () => {
  it('renders tabs and dataAttributes', () => {
    const { getByTestId } = render(<Tabs items={items} index={1} />);
    expect(getByTestId('tab-0')).toBeInTheDocument();
    expect(getByTestId('tab-1')).toBeInTheDocument();
    expect(getByTestId('tab-disabled')).toBeInTheDocument();
  });

  it('switch between tabs', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Tabs items={items} index={1} onChange={onChange} />,
    );

    userEvent.click(getByText('0'));

    expect(onChange).toBeCalledWith(0);
  });

  it('does not switch to a disabled tab', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <Tabs items={items} index={1} onChange={onChange} />,
    );

    userEvent.click(getByText('disabled'));

    expect(onChange).not.toBeCalled();
  });
});
