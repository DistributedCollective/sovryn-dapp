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
