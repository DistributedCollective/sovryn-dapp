import { ComponentStory } from '@storybook/react';

import React from 'react';

import { Heading } from './Heading';
import { HeadingType } from './Heading.types';

export default {
  title: 'Atoms/Heading',
  component: Heading,
};

const Template: ComponentStory<typeof Heading> = args => (
  <Heading {...args} children={`Heading ${args.type}`} />
);

export const Default = Template.bind({});

Default.args = {
  type: HeadingType.h1,
};
Default.argTypes = {
  className: {
    control: 'text',
    description: 'The class to apply to the heading',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  children: {
    control: 'text',
    description:
      'The content of the heading. Can be text, other components, or HTML elements.',
  },
  type: {
    control: 'select',
    options: Object.values(HeadingType),
    description: 'The type of the element',
  },
};

const _All: ComponentStory<typeof Heading> = () => (
  <>
    <Heading type={HeadingType.h1} children="Heading H1" className="mb-1" />
    <Heading type={HeadingType.h2} children="Heading H2" className="mb-1" />
    <Heading type={HeadingType.h3} children="Heading H3" />
  </>
);

export const All = _All.bind({});
All.argTypes = { ...Default.argTypes };
