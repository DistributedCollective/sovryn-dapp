import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { useState } from 'react';

import { VerticalTabsMobile } from './VerticalTabsMobile';
import { VerticalTabsMobileItem } from './VerticalTabsMobile.types';

const DISABLED_TAB = 1;
const TAB_ITEMS: VerticalTabsMobileItem[] = [
  {
    label: 'Tab 1',
    infoText: 'Info text 1',
    content: 'Content 1',
  },
  {
    label: 'Tab 2',
    disabled: true,
    content: 'Content 2',
  },
  {
    label: 'Tab 3',
    content: 'Content 3',
  },
];

const TestComponent = () => {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <VerticalTabsMobile
      items={TAB_ITEMS}
      selectedIndex={index}
      onChange={setIndex}
      header={() => <p>This is header</p>}
    />
  );
};

describe('VerticalTabsMobile', () => {
  it('renders all of the tabs', () => {
    const { getByText } = render(<TestComponent />);

    TAB_ITEMS.forEach(item => {
      expect(getByText(item.label as string)).toBeInTheDocument();
    });
  });

  it('renders header', () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText('This is header')).toBeInTheDocument();
  });

  it('switches tab content when clicked', () => {
    const { getByText } = render(<TestComponent />);

    userEvent.click(getByText(TAB_ITEMS[0].label as string));
    expect(getByText(TAB_ITEMS[0].content as string)).toBeInTheDocument();
  });

  it('does not switch to content of disabled tab', () => {
    const { getByText } = render(<TestComponent />);

    userEvent.click(getByText(TAB_ITEMS[DISABLED_TAB].label as string));
    expect(
      getByText(TAB_ITEMS[DISABLED_TAB].label as string),
    ).toBeInTheDocument();
  });

  it('triggers onChange callback when tab item is clicked', () => {
    const mockFunction = jest.fn();

    const { getByText } = render(
      <VerticalTabsMobile items={TAB_ITEMS} onChange={mockFunction} />,
    );

    userEvent.click(getByText(TAB_ITEMS[0].label as string));
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onChange callback when disabled tab item is clicked', () => {
    const mockFunction = jest.fn();

    const { getByText } = render(
      <VerticalTabsMobile items={TAB_ITEMS} onChange={mockFunction} />,
    );

    userEvent.click(getByText(TAB_ITEMS[DISABLED_TAB].label as string));
    expect(mockFunction).toHaveBeenCalledTimes(0);
  });

  it('adds className to vertical tabs root wrapper', () => {
    const { container } = render(
      <VerticalTabsMobile items={TAB_ITEMS} className="test-class" />,
    );

    // adding "container" to make sure correct element is found
    expect(container.firstChild).toHaveClass('container test-class');
  });

  it('adds className to tab list wrapper', () => {
    const { container } = render(
      <VerticalTabsMobile items={TAB_ITEMS} tabsClassName="test-class" />,
    );

    // adding "aside" to make sure correct element is found
    expect(container.firstChild?.childNodes[0]).toHaveClass('aside test-class');
  });
});
