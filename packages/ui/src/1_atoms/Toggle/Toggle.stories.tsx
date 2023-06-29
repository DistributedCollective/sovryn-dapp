import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Toggle, ToggleAlignment } from './Toggle';

export default {
  title: 'Atoms/Toggle',
  component: Toggle,
};

const Template: Story<ComponentProps<typeof Toggle>> = args => (
  <Toggle {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  label: 'Toggle label',
  alignment: ToggleAlignment.LEFT,
};

Basic.argTypes = {
  label: {
    control: 'text',
    description: 'The label to display for the toggle',
  },
  alignment: {
    control: 'select',
    options: Object.values(ToggleAlignment),
    description: 'The alignment of the toggle label',
  },
  onChange: {
    control: 'function',
    description: 'The onChange handler for the toggle',
  },
  checked: {
    control: 'boolean',
    description: 'Toggle checked state',
  },
  disabled: {
    control: 'boolean',
    description: 'Toggle disabled state',
  },
  className: {
    control: 'text',
    description: 'The class to apply to the toggle',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  inline: {
    control: 'boolean',
    description: 'Whether to display the toggle inline',
  },
};
