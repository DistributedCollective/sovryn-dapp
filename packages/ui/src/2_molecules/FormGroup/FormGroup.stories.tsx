import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Icon,
  IconNames,
  Input,
} from '../../1_atoms';
import { FormGroup } from './FormGroup';

export default {
  title: 'Molecule/FormGroup',
  component: FormGroup,
};

const Template: Story<ComponentProps<typeof FormGroup>> = args => (
  <FormGroup {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  className: '',
  label: 'label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  subtext: 'subtext subtext',
  children: <Input placeholder="Text" />,
};

export const Invalid = Template.bind({});
Invalid.args = {
  className: '',
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  children: <Input placeholder="Text" invalid />,
  errorLabel: 'This field is not valid',
};

export const WithButton = Template.bind({});
WithButton.args = {
  className: '',
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  children: (
    <Button size={ButtonSize.large} style={ButtonStyle.secondary} text="test" />
  ),
};
