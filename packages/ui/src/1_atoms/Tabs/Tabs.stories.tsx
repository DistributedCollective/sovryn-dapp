import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Tabs } from './Tabs';
import { TabSize, TabType } from './Tabs.types';

export default {
  title: 'Atoms/Tabs',
  component: Tabs,
};

const Template: Story<ComponentProps<typeof Tabs>> = args => {
  const [index, setIndex] = useState(args.index);
  return <Tabs {...args} onChange={setIndex} index={index} />;
};

export const Primary = Template.bind();
Primary.args = {
  items: [
    {
      label: 'Default',
      content: <div>Default</div>,
      activeClassName: 'border-t-primary-30',
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,

      activeClassName: 'border-t-positive',
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      activeClassName: 'border-t-negative',
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      disabled: true,
      activeClassName: '',
    },
  ],
  index: 0,
  withBorder: true,
  contentClassName: 'p-4',
  size: TabSize.normal,
  type: TabType.primary,
};

export const Secondary = Template.bind();
Secondary.args = {
  items: [
    {
      label: 'Default',
      content: <div>Default</div>,
      activeClassName: 'text-primary-30',
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,
      activeClassName: 'text-positive',
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      activeClassName: 'text-negative',
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      disabled: true,
      activeClassName: '',
    },
  ],
  index: 0,
  withBorder: true,
  contentClassName: 'p-4',
  size: TabSize.normal,
  type: TabType.secondary,
};
