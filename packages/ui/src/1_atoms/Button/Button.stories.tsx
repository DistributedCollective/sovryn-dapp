import { Story, Meta } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Button } from './Button';
import { ButtonSize, ButtonStyle, ButtonType } from './Button.types';

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta;

const Template: Story<ComponentProps<typeof Button>> = args => (
  <Button {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: 'Button',
  type: ButtonType.button,
  size: ButtonSize.small,
  style: ButtonStyle.primary,
  loading: false,
  disabled: false,
};

Default.argTypes = {
  className: {
    control: 'text',
    description: 'The className to apply to the button',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  loading: {
    control: 'boolean',
    description: 'Button loading state',
  },
  disabled: {
    control: 'boolean',
    description: 'Button disabled state',
  },
  style: {
    control: 'select',
    options: Object.values(ButtonStyle),
    defaultValue: ButtonStyle.primary,
    description: 'The style to apply to the button',
  },
  size: {
    control: 'select',
    options: Object.values(ButtonSize),
    defaultValue: ButtonSize.small,
    description: 'The size to apply to the button',
  },
  type: {
    control: 'select',
    options: Object.values(ButtonType),
    defaultValue: ButtonType.button,
    description: 'The type to apply to the button',
  },
  onClick: {
    control: 'function',
    description:
      'The onClick handler for the button, triggered whenever the button is clicked',
  },
  text: {
    control: 'text',
    description:
      'The content of the button. Can be text, other components, or HTML elements.',
  },
};

export const LinkInternal = Template.bind({});
LinkInternal.args = {
  text: "Internal Link (Doesn't work in Storybook)",
  href: '/?path=/story/atoms-button--default',
  style: ButtonStyle.ghost,
  type: ButtonType.button,
  size: ButtonSize.small,
  loading: false,
  disabled: false,
};
LinkInternal.argTypes = {
  ...Default.argTypes,
  href: {
    control: 'text',
    description:
      'The URL that the anchor tag should point to. If provided, an anchor tag will be rendered',
  },
};

export const LinkExternal = Template.bind({});
LinkExternal.args = {
  text: 'External Link',
  href: 'https://live.sovryn.app',
  hrefExternal: true,
  style: ButtonStyle.ghost,
  size: ButtonSize.small,
  type: ButtonType.button,
  loading: false,
  disabled: false,
};
LinkExternal.argTypes = {
  ...LinkInternal.argTypes,
  hrefExternal: {
    control: 'boolean',
    description:
      'If set to `true`, the anchor tag will open the link in a new tab or window',
  },
};

const renderButton = (style: ButtonStyle, size: ButtonSize, props) => (
  <div className="flex-grow w-1/5 text-center">
    <Button
      style={style}
      size={size}
      text={[style, size].join(' ')}
      {...props}
    />
  </div>
);

const Variations = ({ ...props }) => (
  <>
    <div className="flex flex-row justify-evenly items-center mb-4 space-x-4">
      {renderButton(ButtonStyle.primary, ButtonSize.large, props)}
      {renderButton(ButtonStyle.secondary, ButtonSize.large, props)}
      {renderButton(ButtonStyle.ghost, ButtonSize.large, props)}
    </div>
    <div className="flex flex-row justify-evenly items-center mb-4 space-x-4">
      {renderButton(ButtonStyle.primary, ButtonSize.small, props)}
      {renderButton(ButtonStyle.secondary, ButtonSize.small, props)}
      {renderButton(ButtonStyle.ghost, ButtonSize.small, props)}
    </div>
  </>
);

type AllVariationsProps = {
  loading: boolean;
  disabled: boolean;
  href: string;
  hrefExternal: boolean;
};

export const AllVariations: React.FC<AllVariationsProps> = props => (
  <>
    <Variations {...props} />
    <Variations {...props} disabled />
  </>
);
