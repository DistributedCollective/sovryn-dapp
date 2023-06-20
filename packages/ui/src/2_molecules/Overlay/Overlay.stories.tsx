import { Story } from '@storybook/react';

import React, { ComponentProps, useCallback, useState } from 'react';

import { Button } from '../../1_atoms';
import { Align, AlignVertical } from '../../types';
import { Overlay } from './Overlay';
import { OverlayBackground } from './Overlay.types';

export default {
  title: 'Molecule/Overlay',
  component: Overlay,
};

const Template: Story<ComponentProps<typeof Overlay>> = args => (
  <Overlay {...args} />
);

const InteractiveTemplate: Story<ComponentProps<typeof Overlay>> = args => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(open => !open), []);

  return (
    <div className="relative mx-auto w-80 h-80 p-8 bg-gray-3 text-center">
      <Button onClick={toggleOpen} text="open" />
      <Overlay {...args} isOpen={open} onBlur={toggleOpen} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  portalTarget: 'body',
  children: 'Overlay Active',
  fixed: true,
};
Basic.argTypes = {
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the overlay',
  },
  portalClassName: {
    control: 'text',
    description: 'The className to apply to the overlay portal',
  },
  children: {
    control: 'text',
    description:
      'The content of the overlay. Can be text, other components, or HTML elements.',
  },
  onBlur: {
    control: 'function',
    description: 'The onBlur handler for the overlay',
  },
  background: {
    control: 'select',
    options: Object.values(OverlayBackground),
    description: 'The overlay background',
    defaultValue: OverlayBackground.default,
  },
  align: {
    control: 'select',
    options: Object.values(Align),
    description: 'The overlay alignment',
    defaultValue: Align.center,
  },
  alignVertical: {
    control: 'select',
    options: Object.values(AlignVertical),
    description: 'The overlay vertical alignment',
    defaultValue: AlignVertical.center,
  },
  isOpen: {
    control: 'boolean',
    description: 'The open state of the overlay',
    defaultValue: true,
  },
  fixed: {
    control: 'boolean',
    description: 'The option to set overlay position fixed',
    defaultValue: false,
  },
  zIndex: {
    control: 'number',
    description: 'The overlay z-index',
  },
  portalTarget: {
    control: 'string',
    description: 'The portal targeted element',
  },
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  portalTarget: 'body',
  children: 'Overlay Active',
};
Interactive.argTypes = {
  ...Basic.argTypes,
};
