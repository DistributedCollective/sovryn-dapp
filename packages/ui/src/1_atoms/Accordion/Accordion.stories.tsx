import { useArgs } from '@storybook/client-api';
import { Story, Meta } from '@storybook/react';

import React, { ComponentProps, useCallback } from 'react';

import {
  Dropdown,
  DropdownMode,
  DropdownSize,
  Menu,
  MenuItem,
} from '../../2_molecules';
import { Paragraph } from '../Paragraph/Paragraph';
import { Accordion } from './Accordion';

export default {
  title: 'Atoms/Accordion',
  component: Accordion,
} as Meta;

const Template: Story<ComponentProps<typeof Accordion>> = args => {
  const [, updateArgs] = useArgs();
  const handleOnChange = useCallback(
    (toOpen: boolean) => updateArgs({ open: toOpen }),
    [updateArgs],
  );

  return <Accordion {...args} onClick={handleOnChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: 'Test (click to toggle)',
  children: <div>Simple Test content</div>,
  disabled: false,
  dataLayoutId: 'accordion-simple',
};

export const RichContent = Template.bind({});
RichContent.args = {
  label: 'Test (click to toggle)',
  children: (
    <div className="w-75 bg-gray-30 p-3 rounded">
      <Paragraph className="mb-2 text-gray-80">Content panel</Paragraph>
      <Dropdown
        text="Dropdown Button"
        size={DropdownSize.large}
        mode={DropdownMode.sameWidth}
      >
        <Menu>
          <MenuItem text="Dropdown Item 1" />
          <MenuItem text="Dropdown Item 2" />
          <MenuItem text="Dropdown Item 3" />
        </Menu>
      </Dropdown>
    </div>
  ),
  disabled: false,
  dataLayoutId: 'accordion-richcontent',
};

export const OpenAndDisabled = Template.bind({});
OpenAndDisabled.args = {
  label: 'Test (disabled)',
  children: (
    <div className="w-75 bg-gray-30 p-3 rounded">
      <Paragraph className="mb-2 text-gray-80">Content panel</Paragraph>
      <Dropdown
        text="Dropdown Button"
        size={DropdownSize.large}
        mode={DropdownMode.sameWidth}
      >
        <Menu>
          <MenuItem text="Dropdown Item 1" />
          <MenuItem text="Dropdown Item 2" />
          <MenuItem text="Dropdown Item 3" />
        </Menu>
      </Dropdown>
    </div>
  ),
  disabled: true,
  open: true,
  dataLayoutId: 'accordion-opendisabled',
};
