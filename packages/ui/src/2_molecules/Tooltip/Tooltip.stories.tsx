import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Button, Icon, Link } from '../../1_atoms';
import { Tooltip } from './Tooltip';
import { TooltipPlacement, TooltipTrigger } from './Tooltip.types';

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
