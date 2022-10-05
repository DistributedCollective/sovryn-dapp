import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Tabs } from './Tabs';
import { TabColor, TabSize, TabStyle } from './Tabs.types';

export default {
  title: 'Atoms/Tabs',
  component: Tabs,
};

const Template: Story<ComponentProps<typeof Tabs>> = args => <Tabs {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  items: [
    {
      label: 'Default',
      content: <div>Default</div>,
    },
    {
      label: 'Buy',
      content: <div>Buy</div>,
      color: TabColor.buy,
    },
    {
      label: 'Sell',
      content: <div>Sell</div>,
      color: TabColor.sell,
    },
    {
      label: 'Disabled',
      content: <div>Disabled</div>,
      color: TabColor.sell,
      disabled: true,
    },
  ],
  index: 0,
  withBorder: true,
  contentClassName: 'p-4',
  style: TabStyle.primary,
  size: TabSize.normal,
};
