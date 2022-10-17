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
      dataLayoutId: 'default',
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,
      activeClassName: 'border-t-positive',
      dataLayoutId: 'buy',
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      activeClassName: 'border-t-negative',
      dataLayoutId: 'sell',
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      disabled: true,
      activeClassName: '',
      dataLayoutId: 'disabled',
    },
  ],
  index: 0,
  contentClassName: 'p-6',
  className: '',
  size: TabSize.normal,
  type: TabType.primary,
};

export const Secondary = Template.bind({});
Secondary.args = {
  items: [
    {
      label: 'Default',
      content: <div>Default</div>,
      activeClassName: 'text-primary-20',
      dataLayoutId: 'default',
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,
      activeClassName: 'text-positive',
      dataLayoutId: 'buy',
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      activeClassName: 'text-negative',
      dataLayoutId: 'sell',
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      disabled: true,
      activeClassName: '',
      dataLayoutId: 'disabled',
    },
  ],
  index: 0,
  contentClassName: 'p-4',
  className: '',
  size: TabSize.normal,
  type: TabType.secondary,
};
