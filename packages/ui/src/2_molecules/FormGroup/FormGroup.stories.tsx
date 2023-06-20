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
Basic.argTypes = {
  className: {
    control: 'text',
    description: 'The className to apply to the form-group wrapper',
  },
  label: {
    control: 'text',
    description:
      'The content of the form label. Can be text, other components, or HTML elements.',
  },
  subtext: {
    control: 'text',
    description:
      'The content of the form label subtext. Can be text, other components, or HTML elements.',
  },
  helper: {
    control: 'text',
    description:
      'The form group help information. Can be text, other components, or HTML elements.',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
  errorLabel: {
    control: 'text',
    description: 'The errorLabel state to show an error alert',
  },
  labelElement: {
    control: 'text',
    description: 'The type of element to render as label',
    defaultValue: 'label',
  },
  children: {
    control: 'text',
    description:
      'The content of the form-group. Can be Input, other components, or HTML elements.',
  },
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
Invalid.argTypes = {
  ...Basic.argTypes,
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
WithButton.argTypes = {
  ...Basic.argTypes,
};
