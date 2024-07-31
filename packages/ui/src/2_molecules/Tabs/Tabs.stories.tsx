import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Tabs } from './Tabs';
import { TabSize, TabType } from './Tabs.types';

export default {
  title: 'Molecule/Tabs',
  component: Tabs,
};

const Template: Story<ComponentProps<typeof Tabs>> = args => {
  const [index, setIndex] = useState(args.index);
  return <Tabs {...args} onChange={setIndex} index={index} />;
};

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      label: 'Default',
      content: <div>Default</div>,
      activeClassName: 'border-t-primary-30',
      dataAttribute: 'default',
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,
      activeClassName: 'border-t-positive',
      dataAttribute: 'buy',
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      activeClassName: 'border-t-negative',
      dataAttribute: 'sell',
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      disabled: true,
      activeClassName: '',
      dataAttribute: 'disabled',
    },
  ],
  index: 0,
  contentClassName: 'p-6',
  className: '',
  size: TabSize.normal,
  type: TabType.primary,
};
Primary.argTypes = {
  className: {
    control: 'text',
    description: 'The class to apply to the wrapper',
  },
  contentClassName: {
    control: 'text',
    description: 'The class applied to the content',
  },
  index: {
    control: 'number',
    description: 'Active tab index',
  },
  items: {
    control: 'ITabItem[]',
    description: 'List of tab items',
  },
  onChange: {
    control: 'function',
    description: 'onChange handler for tabs. Fired when active tab is changed',
  },
  type: {
    control: {
      type: 'select',
      options: Object.values(TabType),
    },
    description: 'The tab type',
  },
  size: {
    control: {
      type: 'select',
      options: Object.values(TabSize),
    },
    description: 'The tab size',
  },
};

export const Secondary = Template.bind({});
Secondary.args = {
  items: [
    {
      label: 'Default',
      content: <div>Default</div>,
      activeClassName: 'text-primary-20',
      dataAttribute: 'default',
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,
      activeClassName: 'text-positive',
      dataAttribute: 'buy',
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      activeClassName: 'text-negative',
      dataAttribute: 'sell',
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      disabled: true,
      activeClassName: '',
      dataAttribute: 'disabled',
    },
  ],
  index: 0,
  contentClassName: 'p-4',
  className: '',
  size: TabSize.normal,
  type: TabType.secondary,
};
Secondary.argTypes = {
  ...Primary.argTypes,
};

export const Slider = Template.bind({});
Slider.args = {
  items: [
    {
      label: 'Lend',
      content: <div>Lend tab description</div>,
      dataAttribute: 'lend',
    },
    {
      label: 'Borrow',
      content: <div>Borrow tab description</div>,
      dataAttribute: 'borrow',
    },
  ],
  index: 0,
  contentClassName: 'p-4',
  className: '',
  size: TabSize.normal,
  type: TabType.slider,
};
