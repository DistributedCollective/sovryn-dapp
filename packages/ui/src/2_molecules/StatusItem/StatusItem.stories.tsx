import { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import { StatusItem } from './StatusItem';
import { StatusType } from './StatusItem.types';

export default {
  title: 'Molecule/StatusItem',
  component: StatusItem,
} as ComponentMeta<typeof StatusItem>;

const Template: ComponentStory<typeof StatusItem> = args => (
  <StatusItem {...args} />
);

export const Default = Template.bind({});
Default.args = {
  status: StatusType.idle,
  label: 'Lorem Ipsum',
  content: '1',
  dataAttribute: '',
  className: '',
};
Default.argTypes = {
  className: {
    control: 'text',
    description: 'The class to apply to the status item',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attributes to apply to the status item',
  },
  label: {
    control: 'text',
    description: 'The label of the status item',
  },
  content: {
    control: 'text',
    description: 'The content displayed inside the badge',
  },
  status: {
    control: {
      type: 'select',
      options: Object.values(StatusType),
    },
    description: 'The status for the badge',
  },
};

const AllTemplate: ComponentStory<typeof StatusItem> = args => (
  <>
    <StatusItem {...args} status={StatusType.idle} content="1" />
    <StatusItem {...args} status={StatusType.success} />
    <StatusItem {...args} status={StatusType.error} />
    <StatusItem {...args} status={StatusType.pending} />
  </>
);

export const All = AllTemplate.bind({});
All.args = {
  label: 'Lorem Ipsum',
  dataAttribute: '',
  className: 'my-4',
};
All.argTypes = {
  ...Default.argTypes,
};
