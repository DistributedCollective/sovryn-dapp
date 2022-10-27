import { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import { StatusItem } from './StatusItem';
import { StatusEnum } from './StatusItem.types';

export default {
  title: 'Molecule/StatusItem',
  component: StatusItem,
} as ComponentMeta<typeof StatusItem>;

const Template: ComponentStory<typeof StatusItem> = args => (
  <StatusItem {...args} />
);

export const Default = Template.bind({});
Default.args = {
  status: StatusEnum.idle,
  label: 'Lorem Ipsum',
  content: '1',
  dataLayoutId: '',
  className: '',
};

const AllTemplate: ComponentStory<typeof StatusItem> = args => (
  <>
    <StatusItem {...args} status={StatusEnum.idle} content="1" />
    <StatusItem {...args} status={StatusEnum.success} />
    <StatusItem {...args} status={StatusEnum.error} />
    <StatusItem {...args} status={StatusEnum.pending} />
  </>
);

export const All = AllTemplate.bind({});
All.args = {
  label: 'Lorem Ipsum',
  dataLayoutId: '',
  className: 'my-4',
};
