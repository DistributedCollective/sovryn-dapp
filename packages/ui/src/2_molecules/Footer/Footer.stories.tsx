import { Story } from '@storybook/react';

import React, { ComponentProps } from 'react';

import { Icon, Link, LinkBase } from '../../1_atoms';
import SovrynLogo from '../../../assets/images/logo-sovryn.svg';
import { Header } from '../Header';
import { Footer } from './Footer';

const socials = [
  {
    id: 'discord',
    icon: 'discord-logo',
  },
  {
    id: 'github',
    icon: 'github-logo',
  },
];

const footerArgs = {
  dataLayoutId: '',
  leftContent: (
    <Link
      href="/"
      text={<img className="max-h-4" src={SovrynLogo} alt="Sovryn logo" />}
    />
  ),
  links: (
    <>
      <Link href="/" text="Getting started" className="mr-7" />
      <Link
        href="https://live.sovryn.app"
        openNewTab
        text="Sovryn Alpha"
        className="mr-7"
      />
      <Link
        href="https://www.sovryn.app/blog"
        openNewTab
        text="Blog"
        className="mr-7"
      />
    </>
  ),
  rightContent: (
    <>
      {socials.map(item => (
        <LinkBase
          key={item.id}
          className="ml-2 border border-white/10 text-sov-white rounded-full w-6 h-6 p-1.5 flex justify-center items-center hover:bg-gray-80"
          href="/"
          children={<Icon icon={item.icon} size={14} />}
        />
      ))}
    </>
  ),
};

export default {
  title: 'Molecule/Footer',
  component: Footer,
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

const Template: Story<ComponentProps<typeof Footer>> = args => (
  <Footer {...args} />
);

export const Basic = Template.bind({});
Basic.args = footerArgs;

const Advanced: Story<ComponentProps<typeof Footer>> = args => (
  <div className="min-h-96 bg-gray-90">
    <Header
      logo={
        <Link
          href="/"
          text={<img className="max-h-4" src={SovrynLogo} alt="Sovryn logo" />}
        />
      }
    />
    <Footer {...args} />
  </div>
);

export const FixedFooter = Advanced.bind({});
FixedFooter.args = footerArgs;
