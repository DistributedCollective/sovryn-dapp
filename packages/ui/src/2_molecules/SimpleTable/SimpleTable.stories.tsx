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
