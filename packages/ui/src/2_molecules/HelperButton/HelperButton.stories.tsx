import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Link } from '../../1_atoms';
import { HelperButton } from './HelperButton';

export default {
  title: 'Molecule/HelperButton',
  component: HelperButton,
};

const Template: Story<ComponentProps<typeof HelperButton>> = args => (
  <div className="w-2.5">
    <HelperButton {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  content: (
    <div>
      <div>
        A web3 wallet is a home for your digital assets. You can use it to send,
        receive, and store digital assets.
      </div>
      <div>
        <Link
          text="Read more"
          href="https://wiki.sovryn.app/en/getting-started/wallet-setup"
        />
      </div>
    </div>
  ),
};
Basic.argTypes = {
  content: {
    control: 'text',
    description:
      'The content of the helper button tooltip. Can be text, other components, or HTML elements.',
  },
  className: {
    control: 'text',
    description: 'The className to apply to the helper button',
  },
  dataAttribute: {
    control: 'text',
    description:
      'The data id to apply as HTML attribute to this component instance. This should be unique per component instance on the page',
  },
};
