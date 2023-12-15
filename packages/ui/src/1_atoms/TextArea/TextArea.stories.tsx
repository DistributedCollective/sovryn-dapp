import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { TextArea, TextAreaProps } from './TextArea';
import { TextAreaSize } from './TextArea.types';

export default {
  title: 'Atoms/TextArea',
  component: TextArea,
  args: { size: TextAreaSize.large },
  argTypes: {
    size: {
      options: ['Small', 'Large'],
      mapping: {
        Small: TextAreaSize.small,
        Large: TextAreaSize.large,
      },
    },
  },
};

const Template: Story<ComponentProps<typeof TextArea>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (value: string) => updateArgs({ value }),
    [updateArgs],
  );
  return <TextArea {...args} onChangeText={handleOnChange} />;
};

const AdvancedTemplate: Story<ComponentProps<typeof TextArea>> = args => {
  const [value, setValue] = useState('hello world');

  return (
    <div>
      <TextArea {...args} value={value} onChangeText={setValue} />
      <p>
        This value will change after {args.debounce}ms: {value}
      </p>
    </div>
  );
};

export const TextInput = Template.bind({});
TextInput.args = {
  value: 'example input text',
  type: 'text',
};

TextInput.argTypes = {
  size: {
    control: 'select',
    options: Object.values(TextAreaSize),
    description: 'The size of the input',
  },
  value: {
    control: 'text',
    description: 'The value of the input',
  },
  dataAttribute: {
    control: 'text',
    description: 'The data attributes to apply to the input',
  },
  debounce: {
    control: 'number',
    description: 'The debounce time in ms',
  },
  onChangeText: {
    control: 'function',
    description:
      "The onChange handler for the input, triggered whenever the input's value changes",
  },
  classNameInput: {
    control: 'text',
    description: 'The class to apply to the input',
  },
  invalid: {
    control: 'boolean',
    description:
      'Whether the input is invalid. When set to true the error state styling and behaviour will be triggered on the input',
  },
};

export const DebouncedInput = AdvancedTemplate.bind({});
DebouncedInput.args = {
  debounce: 300,
};
DebouncedInput.argTypes = {
  ...TextInput.argTypes,
  debounce: {
    control: 'number',
    description: 'The debounce time in milliseconds',
  },
};

const renderInput = (label: string, props: TextAreaProps) => (
  <div className="w-full">
    <div>{label}</div>
    <TextArea {...props} />
  </div>
);

export const AllVariations: typeof DebouncedInput = props => (
  <div className="flex flex-col justify-evenly items-center mb-4 space-y-4 w-full">
    {[
      { label: 'Empty text', placeholder: 'Enter wallet address' },
      { label: 'With text value', value: 'Hello World' },
      { label: 'Disabled text', value: 'Hello World', disabled: true },
      { label: 'Read-only text', value: 'Hello World', readOnly: true },
      { label: 'Invalid text', value: 'Hello World', invalid: true },
    ].map(input => renderInput(input.label, { ...props, ...input }))}
  </div>
);
AllVariations.args = {
  debounce: 0,
};
AllVariations.argTypes = {
  ...DebouncedInput.argTypes,
};
