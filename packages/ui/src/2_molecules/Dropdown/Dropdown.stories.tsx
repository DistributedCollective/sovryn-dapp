import { Story } from '@storybook/react';

import { ComponentProps } from 'react';

import { Dropdown } from './Dropdown';

export default {
  title: 'Molecule/Dropdown',
  component: Dropdown,
};

const Template: Story<ComponentProps<typeof Dropdown>> = args => (
  <Dropdown {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  text: 'Dropdown Button',
  children: (
    <div>
      <div
        className="my-2"
        onClick={() => alert('Click on the Dropdown Item 1')}
      >
        Dropdown Item 1
      </div>
      <div
        className="my-2"
        onClick={() => alert('Click on the Dropdown Item 2')}
      >
        Dropdown Item 2
      </div>
      <div
        className="my-2"
        onClick={() => alert('Click on the Dropdown Item 3')}
      >
        Dropdown Item 3
      </div>
    </div>
  ),
};
