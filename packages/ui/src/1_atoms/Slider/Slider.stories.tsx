import { Story, Meta } from '@storybook/react';

import React, { ComponentProps, useCallback, useEffect, useState } from 'react';

import { Slider } from './Slider';

export default {
  title: 'Atoms/Slider',
  component: Slider,
} as Meta;

const Template: Story<ComponentProps<typeof Slider>> = args => {
  const [value, setValue] = useState(args.value || 0);

  useEffect(() => {
    setValue(args.value || 0);
  }, [args.value]);

  const handleChange = useCallback(
    (newValue: number | number[], thumbIndex: number) => {
      setValue(newValue);
      if (args.onChange) {
        args.onChange(newValue, thumbIndex);
      }
    },
    [args],
  );

  return <Slider {...args} value={value} onChange={handleChange} />;
};

const RangeSliderTemplate: Story<ComponentProps<typeof Slider>> = ({
  value: initialValue,
  ...args
}) => {
  const [value, setValue] = useState<number | number[]>(
    initialValue || [30, 70],
  );

  const handleChange = (newValue: number | number[], thumbIndex: number) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
    if (args.onChange) args.onChange(newValue, thumbIndex);
  };

  const handleAfterChange = (
    newValue: number | number[],
    thumbIndex: number,
  ) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
    if (args.onAfterChange) args.onAfterChange(newValue, thumbIndex);
  };

  return (
    <Slider
      {...args}
      value={value}
      onChange={handleChange}
      onAfterChange={handleAfterChange}
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  value: 50,
  dataAttribute: 'slider-basic',
};

Basic.argTypes = {
  value: {
    control: 'number',
    description: 'The value of the slider',
  },
  min: {
    control: 'number',
    description: 'The minimum value of the slider',
  },
  max: {
    control: 'number',
    description: 'The maximum value of the slider',
  },
  step: {
    control: 'number',
    description:
      'Value to be added or subtracted on each step the slider makes. Must be greater than zero. max - min should be evenly divisible by the step value',
  },
  onChange: {
    action: 'onChange',
    description:
      'Callback called on every value change. The function will be called with two arguments, the first being the new value(s) the second being thumb index',
  },
  onAfterChange: {
    action: 'onAfterChange',
    description:
      'Callback called only after moving a thumb has ended. The callback will only be called if the action resulted in a change. The function will be called with two arguments, the first being the result value(s) the second being thumb index',
  },
  disabled: {
    control: 'boolean',
    description: "If true the thumbs can't be moved",
  },
  className: {
    control: 'text',
    description: 'The class name to apply to the Slider',
  },
  thumbClassName: {
    control: 'text',
    description: 'The css class set on each thumb node',
  },
  trackClassName: {
    control: 'text',
    description:
      'The css class set on the tracks between the thumbs. In addition track fragment will receive a numbered css class of the form {trackClassName}-{i}, e.g. track-0, track-1, ...',
  },
  thumbActiveClassName: {
    control: 'text',
    description: 'The css class set on the thumb that is currently being moved',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attribute to apply to the Slider',
  },
  isSimple: {
    control: 'boolean',
    description: 'If false applies the rangeSlider class to the Slider',
  },
};

export const RangeSlider = RangeSliderTemplate.bind({});
RangeSlider.args = {
  value: [20, 80],
  step: 5,
  thumbClassName: 'bg-primary',
  trackClassName: 'bg-primary',
  dataAttribute: 'slider-double',
  isSimple: false,
};

RangeSlider.argTypes = {
  ...Basic.argTypes,
};

export const DRangeSlider = RangeSliderTemplate.bind({});
DRangeSlider.args = {
  value: [20, 80],
  step: 10,
  className: 'w-96 m-auto',
  thumbClassName: 'bg-success ring-2 ring-success',
  thumbActiveClassName: 'outline-2 outline-sov-white',
  trackClassName: 'bg-success',
  dataAttribute: 'slider-styled',
  isSimple: false,
};

DRangeSlider.argTypes = {
  ...Basic.argTypes,
};
