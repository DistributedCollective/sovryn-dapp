import { Story } from '@storybook/react';

import React, { ComponentProps, useState } from 'react';

import { Dropdown } from './Dropdown';
import { DropdownMode, DropdownSize } from './Dropdown.types';

export default {
  title: 'Molecule/Dropdown',
  component: Dropdown,
};

const Template: Story<ComponentProps<typeof Dropdown>> = args => (
  <div className="flex justify-center">
    <div className="mr-10">
      <p>Small Size</p>
      <Dropdown {...args} size={DropdownSize.small} />
    </div>
    <div>
      <p>Large size</p>
      <Dropdown {...args} />
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  text: 'Dropdown Button',
  children: (
    <>
      <div>Dropdown Item 1</div>
      <div>Dropdown Item 2</div>
      <div>Dropdown Item 3</div>
    </>
  ),
};

const AdvancedTemplate: Story<ComponentProps<typeof Dropdown>> = () => {
  const [mode, setMode] = useState(DropdownMode.left);

  const data = Object.keys(DropdownMode).map(item => (
    <div onClick={() => setMode(DropdownMode[item])} key={item}>
      Set mode to {item}
    </div>
  ));

  return (
    <Dropdown
      className="m-auto"
      text="Mode control"
      children={data}
      mode={mode}
    />
  );
};

export const Interactive = AdvancedTemplate.bind({});
