import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import React, { useState } from 'react';

import { VerticalTabs } from './VerticalTabs';
import { VerticalTabsItem } from './VerticalTabs.types';

const INITIAL_TAB = 2;
const DISABLED_TAB = 1;
const TAB_ITEMS: VerticalTabsItem[] = [
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
  const [index, setIndex] = useState(INITIAL_TAB);
  return (
    <VerticalTabs
      items={TAB_ITEMS}
      selectedIndex={index}
      onChange={setIndex}
      header={() => <h1>This is header</h1>}
      footer={() => <p>This is footer</p>}
    />
  );
};

describe('VerticalTabs', () => {
  it('renders all of the tabs', () => {
    const { getByText } = render(<TestComponent />);

    TAB_ITEMS.forEach(item => {
      expect(getByText(item.label as string)).toBeInTheDocument();
    });
  });

  it('renders initial content', () => {
    const { getByText } = render(<TestComponent />);
    expect(
      getByText(TAB_ITEMS[INITIAL_TAB].content as string),
    ).toBeInTheDocument();
  });

  it('renders header', () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText('This is header')).toBeInTheDocument();
  });

  it('renders footer', () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText('This is footer')).toBeInTheDocument();
  });

  it('does not render non selected tab content', () => {
    const { getByText } = render(<TestComponent />);
    expect(() => getByText(TAB_ITEMS[0].content as string)).toThrow();
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
      getByText(TAB_ITEMS[INITIAL_TAB].content as string),
    ).toBeInTheDocument();
    expect(() =>
      getByText(TAB_ITEMS[DISABLED_TAB].content as string),
    ).toThrow();
  });

  it('triggers onChange callback when tab item is clicked', () => {
    const mockFunction = jest.fn();

    const { getByText } = render(
      <VerticalTabs
        items={TAB_ITEMS}
        selectedIndex={0}
        onChange={mockFunction}
      />,
    );

    userEvent.click(getByText(TAB_ITEMS[0].label as string));
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onChange callback when disabled tab item is clicked', () => {
    const mockFunction = jest.fn();

    const { getByText } = render(
      <VerticalTabs
        items={TAB_ITEMS}
        selectedIndex={0}
        onChange={mockFunction}
      />,
    );

    userEvent.click(getByText(TAB_ITEMS[DISABLED_TAB].label as string));
    expect(mockFunction).toHaveBeenCalledTimes(0);
  });

  it('adds className to vertical tabs root wrapper', () => {
    const { container } = render(
      <VerticalTabs
        items={TAB_ITEMS}
        selectedIndex={0}
        className="test-class"
      />,
    );
    // adding "container" to make sure correct element is found
    expect(container.firstChild).toHaveClass('container test-class');
  });

  it('adds className to tab list wrapper', () => {
    const { container } = render(
      <VerticalTabs
        items={TAB_ITEMS}
        selectedIndex={0}
        tabsClassName="test-class"
      />,
    );

    // adding "aside" to make sure correct element is found
    expect(container.firstChild?.childNodes[0]).toHaveClass('aside test-class');
  });

  it('adds className to tab content wrapper', () => {
    const { container } = render(
      <VerticalTabs
        items={TAB_ITEMS}
        selectedIndex={0}
        contentClassName="test-class"
      />,
    );

    // adding "content" to make sure correct element is found
    expect(container.firstChild?.childNodes[1]).toHaveClass(
      'content test-class',
    );
  });
});
