import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Button } from '../../1_atoms';
import { ButtonStyle } from '../../1_atoms/Button/Button.types';
import SovrynLogo from '../../../assets/images/logo-sovryn.svg';
import { NavMenuItem } from '../NavMenuItem/NavMenuItem';
import { WalletIdentity } from '../WalletIdentity/WalletIdentity';
import { Header } from './Header';

export default {
  title: 'Molecule/Header',
  component: Header,
  parameters: {
    backgrounds: {
      default: 'custom',
      values: [
        {
          name: 'custom',
          value: 'white',
        },
      ],
    },
  },
};

const Template: Story<ComponentProps<typeof Header>> = args => (
  <Header {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  dataLayoutId: '',
  logo: <img src={SovrynLogo} alt="Sovryn logo" />,
  menuItems: (
    <>
      <NavMenuItem children="Zero" />
      <NavMenuItem children="Perpetuals" />
    </>
  ),
  secondaryContent: (
    <>
      <Button
        className="mr-6"
        text="Send/Receive"
        style={ButtonStyle.secondary}
      />
      <WalletIdentity address="0xEDb8897aB6E907bc63CB256f74437D36298507E2" />
    </>
  ),
};
