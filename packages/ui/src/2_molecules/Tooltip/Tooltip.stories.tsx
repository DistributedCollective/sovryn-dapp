import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Button, Icon, Link } from '../../1_atoms';
import { Tooltip } from './Tooltip';
import {
  TooltipPlacement,
  TooltipStyle,
  TooltipTrigger,
} from './Tooltip.types';

export default {
  title: 'Molecule/Tooltip',
  component: Tooltip,
};

const Template: Story<ComponentProps<typeof Tooltip>> = args => (
  <div className="flex justify-center items-center h-96 w-full">
    <Tooltip {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  content: (
    <div className="max-w-52">
      Click here to fund your wallet and get started with Sovryn
      <Link
        className="mt-4 block text-blue-2 hover:no-underline"
        text="Read more"
        href="#"
      />
    </div>
  ),
  children: (
    <div>
      <Icon icon="info" />
    </div>
  ),
  className: '',
  tooltipClassName: '',
  dataAttribute: '',
  placement: TooltipPlacement.top,
  disabled: false,
  trigger: TooltipTrigger.hover,
  style: TooltipStyle.primary,
};
Basic.argTypes = {
  content: {
    control: 'text',
    description:
      'The opened tooltip content. Can be text, other components, or HTML elements.',
  },
  children: {
    control: 'text',
    description:
      'The element to show a tooltip on top of. Can be text, other components, or HTML elements.',
  },
  className: {
    control: 'text',
    description: 'The class to apply to target element',
  },
  tooltipClassName: {
    control: 'text',
    description: 'The class to apply to the tooltip',
  },
  activeClassName: {
    control: 'text',
    description: 'The class to apply to the tooltip when opened',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  onHide: {
    control: 'function',
    description: 'Handler for the tooltip, gets fired when tooltip is closed',
  },
  onShow: {
    control: 'function',
    description: 'Handler for the tooltip, gets fired when tooltip is opened',
  },
  disabled: {
    control: 'boolean',
    description: 'Tooltip disabled state',
  },
  placement: {
    control: {
      type: 'select',
      options: Object.values(TooltipPlacement),
    },
    description: 'The tooltip placement',
    defaultValue: TooltipPlacement.top,
  },
  trigger: {
    control: {
      type: 'select',
      options: Object.values(TooltipTrigger),
    },
    description: 'The tooltip trigger behavior',
    defaultValue: TooltipTrigger.hover,
  },
  style: {
    control: 'select',
    options: Object.values(TooltipStyle),
    defaultValue: TooltipStyle.primary,
    description: 'The style to apply to the tooltip',
  },
};

const InteractiveTemplate: Story<ComponentProps<typeof Tooltip>> = args => (
  <div className="flex justify-center mt-32">
    <Tooltip
      {...args}
      onHide={() => console.log('onHide event called')}
      onShow={() => console.log('onShow event called')}
    />
  </div>
);

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  content: (
    <div className="max-w-52">
      Click here to fund your wallet and get started with Sovryn
      <Link
        className="mt-4 block text-blue-2 hover:no-underline"
        text="Read more"
        href="#"
      />
    </div>
  ),
  children: (
    <div>
      <Button text="Info" />
    </div>
  ),
  className: '',
  tooltipClassName: '',
  dataAttribute: '',
  placement: TooltipPlacement.top,
  disabled: false,
  trigger: TooltipTrigger.hover,
};
Interactive.argTypes = { ...Basic.argTypes };
