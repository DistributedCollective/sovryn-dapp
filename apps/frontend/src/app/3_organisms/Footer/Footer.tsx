import React, { FC } from 'react';

import { Link, Footer as UIFooter } from '@sovryn/ui';

import { SocialLinks } from '../../2_molecules';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import Logo from '../../../assets/images/sovryn-small-logo.svg';
import { sovrynLinks } from '../../../utils/constants';

export const Footer: FC = () => {
  const footerLinks = [
    {
      id: 'start',
      href: sovrynLinks.wiki,
      name: 'Getting started',
    },
    {
      id: 'dapp-alfa',
      href: sovrynLinks.dappAlpha,
      name: 'Sovryn Alpha',
    },
    {
      id: 'blog',
      href: sovrynLinks.blog,
      name: 'Blog',
    },
    {
      id: 'fee',
      href: '#',
      name: 'Fee prices',
    },
    {
      id: 'terms',
      href: '#',
      name: 'Terms & Conditions',
    },
    {
      id: 'policy',
      href: '#',
      name: 'Privacy policy',
    },
  ];

  return (
    <UIFooter
      leftContent={
        <SovrynLogo
          image={Logo}
          dataAttribute="logo"
          className="max-h-4 max-w-fit mr-2"
          text="Powered by Bitcoin"
          link="/"
        />
      }
      links={
        <>
          {footerLinks.map(link => (
            <Link
              key={link.id}
              href={link.href}
              text={link.name}
              className="mr-7 mb-5 sm:mb-0"
            />
          ))}
        </>
      }
      rightContent={<SocialLinks />}
    />
  );
};
