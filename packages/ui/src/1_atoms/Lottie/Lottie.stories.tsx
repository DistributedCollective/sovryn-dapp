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
    autoplay: {
      control: {
        type: 'boolean',
        value: true,
      },
    },
    autoPlay: {
      table: {
        disable: true,
      },
    },
    renderer: {
      table: {
        disable: true,
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

Single.argTypes = {
  animation: {
    control: 'select',
    options: Object.keys(animationMap),
    defaultValue: 'spaceScene',
    description: 'Choose the animation to display',
  },
  loop: {
    control: 'select',
    options: [true, 1, 2, 3, 4, 5],
    defaultValue: true,
    description:
      'Set the number of times to loop the animation. Loops indefinitely when set to "true"',
  },
  name: {
    control: 'text',
    description: 'Specify the name of the animation',
  },
  autoplay: {
    control: {
      type: 'boolean',
      value: true,
    },
    description: 'Toggle autoplay for the animation',
  },
  initialSegment: {
    description: 'Define the initial segment of the animation',
  },
  assetsPath: {
    description: 'Provide the path to the assets',
  },
  rendererSettings: {
    description: 'Specify the renderer settings',
  },
  audioFactory: {
    description: 'Configure the audio factory',
  },
  lottieRef: {
    description: 'Refer to the lottie element',
  },
  onComplete: {
    description: 'Handle the onComplete callback',
  },
  onLoopComplete: {
    description: 'Handle the onLoopComplete callback',
  },
  onEnterFrame: {
    description: 'Handle the onEnterFrame callback',
  },
  onSegmentStart: {
    description: 'Handle the onSegmentStart callback',
  },
  onConfigReady: {
    description: 'Handle the onConfigReady callback',
  },
  onDataReady: {
    description: 'Handle the onDataReady callback',
  },
  onDataFailed: {
    description: 'Handle the onDataFailed callback',
  },
  onLoadedImages: {
    description: 'Handle the onLoadedImages callback',
  },
  onDOMLoaded: {
    description: 'Handle the onDOMLoaded callback',
  },
  onDestroy: {
    description: 'Handle the onDestroy callback',
  },
  interactivity: {
    description: 'Configure interactivity settings',
  },
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
  ...Single.argTypes,
};
