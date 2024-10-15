import { ComponentStory } from '@storybook/react';

import React from 'react';

import { FilterPill } from './FilterPill';

export default {
  title: 'Atoms/FilterPill',
  component: FilterPill,
};

const Template: ComponentStory<typeof FilterPill> = args => (
  <FilterPill {...args} />
);

export const Default = Template.bind({});

Default.args = {
  text: 'Stablecoins',
};

Default.argTypes = {
  className: {
    control: 'text',
    description: 'The class to apply to the filter pill',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  text: {
    control: 'text',
    description: 'The label of the filter pill',
  },
  isActive: {
    control: 'boolean',
    description: 'Whether the filter pill is active',
  },
  onClick: {
    action: 'clicked',
    description: 'The function to call when the filter pill is clicked',
  },
};
