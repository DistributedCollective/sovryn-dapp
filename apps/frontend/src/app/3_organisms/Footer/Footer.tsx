import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Link, Footer as UIFooter } from '@sovryn/ui';

import { SocialLinks } from '../../2_molecules';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import Logo from '../../../assets/images/Bitcoin-logo-small.svg';
import { translations } from '../../../locales/i18n';
import { Environments } from '../../../types/global';
import {
  sovrynLinks,
  currentRelease,
  sovrynAlphaLinks,
  sovrynWikiLinks,
  sovrynStagingLink,
  sovrynAlphaStagingLink,
} from '../../../utils/constants';
import { isMainnet, isStaging } from '../../../utils/helpers';
import { getChangelogUrl } from '../../../utils/helpers';

type FooterProps = {
  isEmailVerificationStatePage?: boolean;
};

export const Footer: FC<FooterProps> = ({ isEmailVerificationStatePage }) => {
  const footerLinks = useMemo(
    () => [
      isEmailVerificationStatePage
        ? {
            id: 'dashboard',
            href: isStaging() ? sovrynStagingLink : `/`,
            name: t(translations.footer.dashboard),
          }
        : {
            id: 'start',
            href: `${sovrynWikiLinks.root}/getting-started`,
            name: t(translations.footer.start),
          },
      {
        id: 'dapp-alpha',
        href: isStaging()
          ? sovrynAlphaStagingLink
          : sovrynAlphaLinks[
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
        href: '/policies/terms-of-service',
        name: t(translations.footer.terms),
      },
      {
        id: 'policy',
        href: '/policies/privacy-policy',
        name: t(translations.footer.policy),
      },
    ],
    [isEmailVerificationStatePage],
  );

  return (
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
        <div className="flex flex-row justify-center flex-wrap gap-x-6 gap-y-5">
          {footerLinks.map(link => (
            <Link key={link.id} href={link.href} text={link.name} />
          ))}
        </div>
      }
      rightContent={
        <div className="flex gap-x-2">
          <div className="flex items-center text-xs justify-center">
            <Link
              href={getChangelogUrl(currentRelease.commit)}
              text={`${t(
                translations.footer.buildID,
              )} ${currentRelease.commit?.substring(0, 7)}`}
            />
          </div>
          <SocialLinks dataAttribute="footer-social" />
        </div>
      }
    />
  );
};
