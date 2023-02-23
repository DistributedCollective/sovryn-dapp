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
