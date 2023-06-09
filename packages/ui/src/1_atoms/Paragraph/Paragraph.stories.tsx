import { Story, Meta } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Paragraph } from './Paragraph';
import { ParagraphSize, ParagraphStyle } from './Paragraph.types';

export default {
  title: 'Atoms/Paragraph',
  component: Paragraph,
} as Meta;

const Template: Story<ComponentProps<typeof Paragraph>> = () => (
  <>
    <Paragraph children="small normal medium-weight (defaults)" />
    <br />
    <Paragraph
      size={ParagraphSize.tiny}
      style={ParagraphStyle.normal}
      className="font-normal"
      children="tiny normal regular-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.tiny}
      style={ParagraphStyle.normal}
      children="tiny normal medium-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.normal}
      className="font-normal"
      children="small normal regular-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.small}
      style={ParagraphStyle.normal}
      children="small normal medium-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.normal}
      className="font-normal"
      children="base normal regular-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.normal}
      children="base normal medium-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.tall}
      className="font-normal"
      children="base tall regular-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.tall}
      children="base tall medium-weight"
    />
    <br />
    <Paragraph
      size={ParagraphSize.base}
      style={ParagraphStyle.tall}
      className="font-normal"
      children={
        <>
          Some regular-weight text and then <strong>strong text</strong>
        </>
      }
    />
  </>
);

export const Default = Template.bind({});

Default.argTypes = {
  children: {
    control: 'text',
    description:
      'The content of the paragraph. Can be text, other components, or HTML elements. Underlying DOM element is a Paragraph tag so children should be compliant with this',
  },
  size: {
    control: 'select',
    options: Object.values(ParagraphSize),
    defaultValue: ParagraphSize.small,
    description: 'The size to apply to the paragraph',
  },
  style: {
    control: 'select',
    options: Object.values(ParagraphStyle),
    defaultValue: ParagraphStyle.normal,
    description: 'The style to apply to the paragraph',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the paragraph',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};

const InteractiveTemplate: Story<ComponentProps<typeof Paragraph>> = args => {
  return <Paragraph {...args} />;
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  children: 'You can change this text',
  size: ParagraphSize.base,
  style: ParagraphStyle.normal,
};

Interactive.argTypes = {
  ...Default.argTypes,
};
