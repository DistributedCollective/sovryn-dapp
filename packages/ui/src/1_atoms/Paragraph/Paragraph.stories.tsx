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

const Template: Story<ComponentProps<typeof Paragraph>> = () => (
  <>
    <Paragraph children="Text by default" />
    <br />
    <Paragraph
      size={ParagraphSize.tiny}
      style={ParagraphStyle.normal}
      type={ParagraphType.regular}
      children="tiny normal regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.tiny}
      style={ParagraphStyle.normal}
      type={ParagraphType.medium}
      children="tiny normal medium"
    />
    <br />
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.normal}
      type={ParagraphType.regular}
      children="small normal regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.normal}
      type={ParagraphType.medium}
      children="small normal medium"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.normal}
      type={ParagraphType.regular}
      children="base normal regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.normal}
      type={ParagraphType.medium}
      children="base normal medium"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.tall}
      type={ParagraphType.regular}
      children="base tall regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.tall}
      type={ParagraphType.medium}
      children="base tall medium"
    />
  </>
);

export const Default = Template.bind({});

const InteractiveTemplate: Story<ComponentProps<typeof Paragraph>> = args => {
  return <Paragraph {...args} />;
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  children: 'You can change this text',
  type: ParagraphType.medium,
  size: ParagraphSize.small,
  style: ParagraphStyle.normal,
};
