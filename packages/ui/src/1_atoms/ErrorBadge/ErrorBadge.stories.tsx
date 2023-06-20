import { ComponentStory } from '@storybook/react';

import React from 'react';

import { ErrorBadge } from './ErrorBadge';
import { ErrorLevel } from './ErrorBadge.types';

export default {
  title: 'Atoms/ErrorBadge',
  component: ErrorBadge,
};

const Template: ComponentStory<typeof ErrorBadge> = args => (
  <ErrorBadge {...args} />
);

export const Default = Template.bind({});

Default.args = {
  level: ErrorLevel.Critical,
  message:
    'Zero is in recovery mode. You can still use the system but some functionality is affected. Learn more',
};
Default.argTypes = {
  className: {
    control: 'text',
    description: 'The className to apply to the badge',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  message: {
    control: 'text',
    description: 'The content of the badge',
  },
  level: {
    control: 'select',
    options: Object.values(ErrorLevel),
    description: 'The style to apply to the badge based on the erorr level',
  },
};
