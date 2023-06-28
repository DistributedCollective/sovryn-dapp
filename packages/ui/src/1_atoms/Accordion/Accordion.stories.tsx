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
import { AccordionStyle } from './Accordion.types';

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
  dataAttribute: 'accordion-simple',
};

Default.argTypes = {
  className: {
    control: 'text',
    description: 'The class to apply to the wrapper element',
  },
  label: {
    control: 'text',
    description: 'The label shown on the accordion toggle button',
  },
  labelClassName: {
    control: 'text',
    description: 'The class to apply to the accordion toggle button',
  },
  children: {
    control: 'text',
    description:
      'The content of the accordion. Can be text, other components, or HTML elements.',
  },
  disabled: {
    control: 'boolean',
    description: 'Accordion disabled state',
  },
  open: {
    control: 'boolean',
    description: 'Accordion open state',
  },
  onClick: {
    control: 'function',
    description:
      'The onClick handler for the accordion, triggered whenever the accordion is clicked to open or close',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  style: {
    control: 'select',
    options: Object.values(AccordionStyle),
    defaultValue: AccordionStyle.primary,
    description: 'The style to apply to the accordion',
  },
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
  dataAttribute: 'accordion-richcontent',
};
RichContent.argTypes = {
  ...Default.argTypes,
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
  dataAttribute: 'accordion-opendisabled',
};

OpenAndDisabled.argTypes = {
  ...Default.argTypes,
};
