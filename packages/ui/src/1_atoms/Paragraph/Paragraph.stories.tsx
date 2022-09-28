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
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.short}
      type={ParagraphType.regular}
      children="small short regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.short}
      type={ParagraphType.medium}
      children="small short medium"
    />
    <br />
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.short}
      type={ParagraphType.semibold}
      children="small short semibold"
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
      style={ParagraphStyle.normal}
      type={ParagraphType.semibold}
      children="base normal semibold"
    />
    <br />
    <Paragraph
      size={ParagraphSize.large}
      style={ParagraphStyle.tall}
      type={ParagraphType.regular}
      children="large tall regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.large}
      style={ParagraphStyle.tall}
      type={ParagraphType.medium}
      children="large tall medium"
    />
    <br />
    <Paragraph
      size={ParagraphSize.large}
      style={ParagraphStyle.tall}
      type={ParagraphType.semibold}
      children="large tall semibold"
    />
    <br />
    <Paragraph
      size={ParagraphSize.extraLarge}
      style={ParagraphStyle.normal}
      type={ParagraphType.regular}
      children="extraLarge normal regular"
    />
    <br />
    <Paragraph
      size={ParagraphSize.extraLarge}
      style={ParagraphStyle.normal}
      type={ParagraphType.medium}
      children="extraLarge normal medium"
    />
    <br />
    <Paragraph
      size={ParagraphSize.extraLarge}
      style={ParagraphStyle.normal}
      type={ParagraphType.semibold}
      children="extraLarge normal semibold"
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
  type: ParagraphType.regular,
  size: ParagraphSize.base,
  style: ParagraphStyle.normal,
};
