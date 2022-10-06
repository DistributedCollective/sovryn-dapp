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

export const All = () => (
  <>
    <Heading type={HeadingType.h1} children="Heading H1" className="mb-1" />
    <Heading type={HeadingType.h2} children="Heading H2" className="mb-1" />
    <Heading type={HeadingType.h3} children="Heading H3" />
  </>
);
