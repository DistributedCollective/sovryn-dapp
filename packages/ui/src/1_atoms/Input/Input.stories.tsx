import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { Input, InputProps } from './Input';
import { InputSize } from './Input.types';

export default {
  title: 'Atoms/Input',
  component: Input,
  args: { size: InputSize.large },
  argTypes: {
    size: {
      options: ['Small', 'Large'],
      control: { type: 'radio' },
      mapping: {
        Small: InputSize.small,
        Large: InputSize.large,
      },
    },
  },
};

const Template: Story<ComponentProps<typeof Input>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (value: string) => updateArgs({ value }),
    [updateArgs],
  );
  return <Input {...args} onChangeText={handleOnChange} />;
};

const AdvancedTemplate: Story<ComponentProps<typeof Input>> = args => {
  const [value, setValue] = useState('hello world');

  return (
    <div>
      <Input {...args} value={value} onChangeText={setValue} />
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
    options: Object.values(InputSize),
    description: 'The size of the input',
  },
  value: {
    control: 'text',
    description: 'The value of the input',
  },
  type: {
    control: 'text',
    description: 'The type of the input (`text`, `number`, etc.)',
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
    description: 'The onChange handler for the input',
  },
  classNameInput: {
    control: 'text',
    description: 'The className to apply to the input',
  },
  invalid: {
    control: 'boolean',
    description: 'Whether the input is invalid',
  },
};

export const NumberInput = Template.bind({});
NumberInput.args = {
  value: 13.37,
  step: 1,
  type: 'number',
};
NumberInput.argTypes = {
  ...TextInput.argTypes,
  step: {
    control: 'number',
    description: 'The step value for the input',
  },
  value: {
    control: 'number',
    description: 'The value of the input',
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
    description: 'The debounce time in ms',
  },
};

const renderInput = (label: string, props: InputProps) => (
  <div className="w-full">
    <div>{label}</div>
    <Input {...props} />
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
      {
        label: 'Numeric empty',
        placeholder: 'Enter amount',
        value: '',
        type: 'number',
      },
      { label: 'Numeric with value', value: '100.5', type: 'number' },
      {
        label: 'Numeric read-only',
        value: '100.5',
        type: 'number',
        readOnly: true,
      },
      {
        label: 'Numeric invalid',
        value: '100.5',
        type: 'number',
        invalid: true,
      },
    ].map(input => renderInput(input.label, { ...props, ...input }))}
  </div>
);
AllVariations.args = {
  debounce: 0,
};
AllVariations.argTypes = {
  ...DebouncedInput.argTypes,
};
