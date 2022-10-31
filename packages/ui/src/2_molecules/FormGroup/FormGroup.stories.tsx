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
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  subtext: 'A description of this form element to aid in populating the field.',
  children: <Input placeholder="Text" />,
};

export const Invalid = Template.bind({});
Invalid.args = {
  className: '',
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  subtext: 'A description of this form element to aid in populating the field.',
  children: <Input placeholder="Text" invalid />,
  errorLabel: 'This field is not valid',
};

export const WithButton = Template.bind({});
WithButton.args = {
  className: '',
  label: 'Label',
  helper: <Icon icon={IconNames.INFO} size={10} />,
  subtext: 'A description of this form element to aid in populating the field.',
  children: (
    <Button size={ButtonSize.large} style={ButtonStyle.secondary} text="test" />
  ),
};
