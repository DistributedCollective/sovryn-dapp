import { Story, Meta } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Paragraph } from './Paragraph';
import {
  ParagraphSize,
  ParagraphStyle,
  ParagraphType,
} from './Paragraph.types';

export default {
  title: 'Atoms/Paragraph',
  component: Paragraph,
} as Meta;

const Template: Story<ComponentProps<typeof Paragraph>> = args => (
  <>
    <Paragraph
      {...args}
      size={ParagraphSize.small}
      style={ParagraphStyle.short}
    />
    <br />
    <Paragraph
      {...args}
      size={ParagraphSize.base}
      style={ParagraphStyle.normal}
      type={ParagraphType.regular}
    />
    <br />
    <Paragraph
      {...args}
      size={ParagraphSize.large}
      style={ParagraphStyle.tall}
    />
  </>
);

export const Default = Template.bind({});
Default.args = {
  children:
    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque tempora itaque voluptatum veritatis perferendis temporibus tenetur quod corrupti rerum voluptatibus? Totam a quas recusandae quasi molestiae ipsa omnis dolorum aliquam.',
  type: ParagraphType.regular,
};
