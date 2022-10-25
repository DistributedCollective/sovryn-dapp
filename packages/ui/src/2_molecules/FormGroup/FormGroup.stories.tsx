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

export const _FormGroup = Template.bind({});
_FormGroup.args = {
  className: '',
  label: 'label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  subtext: 'subtext subtext',
  children: <Input placeholder="Text" />,
};

export const _FormGroupInvalid = Template.bind({});
_FormGroupInvalid.args = {
  className: '',
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  children: <Input placeholder="Text" invalid />,
  errorLabel: 'This field is not valid',
};

export const _FormGroupButton = Template.bind({});
_FormGroupButton.args = {
  className: '',
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  children: (
    <Button size={ButtonSize.large} style={ButtonStyle.secondary} text="test" />
  ),
};
