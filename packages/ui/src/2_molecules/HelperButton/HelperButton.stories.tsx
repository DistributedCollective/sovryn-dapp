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
