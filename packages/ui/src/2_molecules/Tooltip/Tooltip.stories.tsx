import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Icon, Link } from '../../1_atoms';
import { Tooltip } from './Tooltip';
import { TooltipPlacement } from './Tooltip.types';

export default {
  title: 'Molecule/Tooltip',
  component: Tooltip,
};

const Template: Story<ComponentProps<typeof Tooltip>> = args => (
  <div className="flex justify-center mt-32">
    <Tooltip {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  content: (
    <>
      Click here to fund your wallet and get started with Sovryn
      <Link
        className="mt-4 block text-blue-2 hover:no-underline"
        text="Read more"
        href="#"
      />
    </>
  ),
  children: (
    <div>
      <Icon icon="info" />
    </div>
  ),
  className: '',
  tooltipClassName: '',
  dataActionId: '',
  placement: TooltipPlacement.TOP,
};

const InteractiveTemplate: Story<ComponentProps<typeof Tooltip>> = args => (
  <div className="flex justify-center mt-32">
    <Tooltip
      {...args}
      onHide={() => alert('onHide event called')}
      onShow={() => alert('onSHow event called')}
    />
  </div>
);

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  content: (
    <>
      Click here to fund your wallet and get started with Sovryn
      <Link
        className="mt-4 block text-blue-2 hover:no-underline"
        text="Read more"
        href="#"
      />
    </>
  ),
  children: (
    <div>
      <Icon icon="info" />
    </div>
  ),
  className: '',
  tooltipClassName: '',
  dataActionId: '',
  placement: TooltipPlacement.TOP,
};
