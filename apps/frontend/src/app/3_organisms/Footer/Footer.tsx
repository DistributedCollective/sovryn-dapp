import React, { FC } from 'react';
import { Link, Footer as UIFooter } from '@sovryn/ui';
import { SocialLinks } from '../../2_molecules';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';

export const Footer: FC = () => {
  const links = [
    {
      id: 'start',
      href: 'https://wiki.sovryn.app/en/getting-started',
      name: 'Getting started',
    },
    {
      id: 'alfa',
      href: 'https://live.sovryn.app/',
      name: 'Sovryn Alpha',
    },
    {
      id: 'blog',
      href: 'https://www.sovryn.app/blog',
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
      leftContent={<SovrynLogo dataAttribute="logo" text="Sovryn" link="/" />}
      links={
        <>
          {links.map(link => (
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
