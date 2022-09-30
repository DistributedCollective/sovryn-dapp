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
};

export const LinkInternal = Template.bind({});
LinkInternal.args = {
  text: "Internal Link (Doesn't work in Storybook)",
  href: '/?path=/story/atoms-button--default',
  style: ButtonStyle.ghost,
};

export const LinkExternal = Template.bind({});
LinkExternal.args = {
  text: 'External Link',
  href: 'https://live.sovryn.app',
  hrefExternal: true,
  style: ButtonStyle.ghost,
  size: ButtonSize.large,
};

const InteractiveTemplate: Story<ComponentProps<typeof Button>> = args => {
  return <Button {...args} />;
};

export const Interactive = InteractiveTemplate.bind({});
Interactive.args = {
  text: 'Button',
  type: ButtonType.button,
  size: ButtonSize.small,
  style: ButtonStyle.primary,
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
