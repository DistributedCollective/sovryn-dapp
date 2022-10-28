import { useArgs } from '@storybook/client-api';
import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback } from 'react';

import { Select } from './Select';
import { SelectOption } from './Select.types';

export default {
  title: 'Molecule/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    controls: {
      exclude: ['onChange', 'labelRenderer'],
    },
  },
};

const options: SelectOption[] = [
  {
    value: '1',
    label: 'Option 1',
  },
  {
    value: '2',
    label: 'Option 2',
  },
  {
    value: '3',
    label: 'Option 3',
  },
];

const Template: Story<ComponentProps<typeof Select>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (value: string) => updateArgs({ value }),
    [updateArgs],
  );

  return (
    <div>
      <Select {...args} onChange={handleOnChange} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  value: options[0].value,
  options,
};

// const AdvancedTemplate: Story<ComponentProps<typeof Dropdown>> = args => {
//   return <Dropdown {...args} />;
// };

// export const Interactive = AdvancedTemplate.bind({});
// Interactive.args = {
//   text: 'Mode control',
//   size: DropdownSize.large,
//   className: 'm-auto',
//   mode: DropdownMode.center,
//   children: (
//     <Menu>
//       <MenuItem text="Dropdown Menu Item 1" />
//       <MenuItem text="Dropdown Menu Item 2" />
//       <MenuItem text="Dropdown Menu Item 3" />
//     </Menu>
//   ),
// };
