import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { Toggle, ToggleAlignment } from './Toggle';

export default {
  title: 'Atoms/Toggle',
  component: Toggle,
};

const Template: Story<ComponentProps<typeof Toggle>> = args => (
  <Toggle {...args} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Toggle>> = args => {
  const [checked, setChecked] = useState(false);
  const onChange = useCallback(() => setChecked(!checked), [checked]);

  return (
    <Toggle
      {...args}
      checked={checked}
      onChange={onChange}
      dataAttribute="test-toggle"
    />
  );
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Toggle label',
  alignment: ToggleAlignment.LEFT,
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  label: 'Toggle label',
  alignment: ToggleAlignment.LEFT,
};
