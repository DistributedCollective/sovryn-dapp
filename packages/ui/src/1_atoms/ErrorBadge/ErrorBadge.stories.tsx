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
