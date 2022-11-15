import { ComponentStory, ComponentMeta } from '@storybook/react';

import React from 'react';

import { Lottie } from './Lottie';
import { LottieAnimation } from './Lottie.types';
import { animationMap } from './animation-map';

export default {
  title: 'Atoms/Lottie',
  component: Lottie,
  argTypes: {
    animation: {
      control: {
        type: 'select',
        options: Object.keys(animationMap),
      },
    },
    loop: {
      control: {
        type: 'select',
        options: [true, 1, 2, 3, 4, 5],
      },
    },
  },
} as ComponentMeta<typeof Lottie>;

const Template: ComponentStory<typeof Lottie> = args => (
  <div className="w-48 h-48">
    <Lottie {...args} />
  </div>
);

export const Single = Template.bind({});
Single.args = {
  animation: 'spaceScene',
  loop: true,
  autoPlay: true,
};

const AllVariantsTemplate: ComponentStory<typeof Lottie> = ({
  animation,
  ...args
}) => (
  <div className="flex gap-4">
    {Object.keys(animationMap).map(item => (
      <div className="w-48 h-48" key={item}>
        <Lottie {...args} animation={item as LottieAnimation} />
      </div>
    ))}
  </div>
);

export const AllVariants = AllVariantsTemplate.bind({});
AllVariants.args = {
  animation: 'spaceScene',
  loop: true,
  autoPlay: true,
};
AllVariants.argTypes = {
  animation: {
    table: {
      disable: true,
    },
  },
};
