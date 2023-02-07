import React, { FC } from 'react';

import { t } from 'i18next';

import { Link, Footer as UIFooter } from '@sovryn/ui';

import { SocialLinks } from '../../2_molecules';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import Logo from '../../../assets/images/sovryn-small-logo.svg';
import { translations } from '../../../locales/i18n';
import { Environments } from '../../../types/global';
import {
  sovrynLinks,
  sovrynAlphaLinks,
  sovrynWikiLinks,
} from '../../../utils/constants';
import { isMainnet } from '../../../utils/helpers';

const footerLinks = [
  {
    id: 'start',
    href: `${sovrynWikiLinks.root}/getting-started`,
    name: t(translations.footer.start),
  },
  {
    id: 'dapp-alpha',
    href: sovrynAlphaLinks[
      isMainnet() ? Environments.Mainnet : Environments.Testnet
    ],
    name: t(translations.footer.alpha),
  },
  {
    id: 'blog',
    href: sovrynLinks.blog,
    name: t(translations.footer.blog),
  },
  {
    id: 'security',
    href: sovrynLinks.security,
    name: t(translations.footer.security),
  },
  {
    id: 'fees',
    href: sovrynLinks.fees,
    name: t(translations.footer.fees),
  },
  {
    id: 'terms',
    href: '/policies/terms-of-use',
    name: t(translations.footer.terms),
  },
  {
    id: 'policy',
    href: '/policies/privacy-policy',
    name: t(translations.footer.policy),
  },
];

export const Footer: FC = () => (
  <UIFooter
    leftContent={
      <SovrynLogo
        image={Logo}
        dataAttribute="footer-logo"
        className="max-h-4 max-w-fit mr-2"
        text="Powered by bitcoin"
        link="/"
      />
    }
    links={
      <div className="flex flex-row justify-center flex-wrap gap-x-7 gap-y-5">
        {footerLinks.map(link => (
          <Link key={link.id} href={link.href} text={link.name} />
        ))}
      </div>
    }
    rightContent={<SocialLinks dataAttribute="footer-social" />}
  />
);
