import { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import { SimpleTable } from './SimpleTable';
import { SimpleTableRow } from './components/SimpleTableRow/SimpleTableRow';

export default {
  title: 'Molecule/SimpleTable',
  component: SimpleTable,
} as ComponentMeta<typeof SimpleTable>;

const Template: ComponentStory<typeof SimpleTable> = args => (
  <SimpleTable className="w-[336px]" {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: (
    <>
      <SimpleTableRow label="Position Size" value="+0.010BTC" />
      <SimpleTableRow label="Position Size" value="+0.010BTC" />
      <SimpleTableRow label="Position Size" value="+0.010BTC" />
      <SimpleTableRow label="Position Size" value="+0.010BTC" />
      <SimpleTableRow label="Position Size" value="+0.010BTC" />
    </>
  ),
  border: true,
};
Primary.argTypes = {
  className: {
    control: 'text',
    description: 'The className to apply to the table',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attributes to apply to the table',
  },
  border: {
    control: 'boolean',
    description: 'Simple table border state',
  },
};
