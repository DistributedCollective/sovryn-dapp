import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { ContextLink } from './ContextLink';

export default {
  title: 'Molecule/ContextLink',
  component: ContextLink,
};

const Template: Story<ComponentProps<typeof ContextLink>> = args => (
  <div className="mt-20 flex justify-center">
    <ContextLink {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: <div>Up to 8.55% APR</div>,
  tooltipContent: (
    <div>
      <p>Before liquidity mining rewards: 2%</p>
      <p>After liquidity mining rewards: 8.55%</p>
    </div>
  ),
};
Basic.argTypes = {
  tooltipContent: {
    control: 'text',
    description:
      'The content of the context link tooltip. Can be text, other components, or HTML elements.',
  },
  children: {
    control: 'text',
    description:
      'The content of the context link. Can be text, other components, or HTML elements.',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the context link',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};
