import { ComponentStory } from '@storybook/react';

import React from 'react';

import { ErrorLevel } from '../../1_atoms';
import { ErrorList } from './ErrorList';

export default {
  title: 'Molecule/ErrorList',
  component: ErrorList,
};

const Template: ComponentStory<typeof ErrorList> = args => (
  <ErrorList {...args} />
);

export const Default = Template.bind({});

Default.args = {
  errors: [
    {
      level: ErrorLevel.Critical,
      message: 'Critical',
    },
    {
      level: ErrorLevel.Warning,
      message: 'Warning',
    },
  ],
  showSingleError: false,
};
Default.argTypes = {
  errors: {
    control: 'ErrorBadgeProps[]',
    description: 'The list of errors to show',
  },
  showSingleError: {
    control: 'boolean',
    description:
      'The state to only render a single error, the error with the most weight.',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the list wrapper trigger button',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};

export const WithWeight = Template.bind({});
WithWeight.args = {
  errors: [
    {
      level: ErrorLevel.Critical,
      message: 'weight 1',
      weight: 1,
    },
    {
      level: ErrorLevel.Critical,
      message: 'weight 0',
      weight: 0,
    },
    {
      level: ErrorLevel.Critical,
      message: 'weight 2',
      weight: 2,
    },
  ],
  showSingleError: false,
};
WithWeight.argTypes = {
  ...Default.argTypes,
};
