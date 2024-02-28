import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { Link, Footer as UIFooter } from '@sovryn/ui';

import { SocialLinks } from '../../2_molecules';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import Logo from '../../../assets/images/Bitcoin-logo-small.svg';
import { CURRENT_RELEASE } from '../../../constants/general';
import {
  WIKI_LINKS,
  STAGING_LINK,
  WEBSITE_LINKS,
} from '../../../constants/links';
import { translations } from '../../../locales/i18n';
import { isStaging } from '../../../utils/helpers';
import { getChangelogUrl } from '../../../utils/helpers';

type FooterProps = {
  showDashboardLink?: boolean;
};

export const Footer: FC<FooterProps> = ({ showDashboardLink }) => {
  const footerLinks = useMemo(
    () => [
      showDashboardLink
        ? {
            id: 'dashboard',
            href: isStaging() ? STAGING_LINK : `/`,
            name: t(translations.footer.dashboard),
          }
        : {
            id: 'start',
            href: `${WIKI_LINKS.ROOT}/getting-started`,
            name: t(translations.footer.start),
          },
      {
        id: 'website',
        href: WEBSITE_LINKS.ROOT,
        name: t(translations.footer.website),
      },
      {
        id: 'blog',
        href: WEBSITE_LINKS.BLOG,
        name: t(translations.footer.blog),
      },
      {
        id: 'security',
        href: WIKI_LINKS.SECURITY,
        name: t(translations.footer.security),
      },
      {
        id: 'fees',
        href: WIKI_LINKS.FEES,
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
      {
        id: 'stats',
        href: '/stats',
        name: t(translations.footer.stats),
        openNewTab: false,
      },
    ],
    [showDashboardLink],
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
            <Link
              key={link.id}
              href={link.href}
              text={link.name}
              openNewTab={link.openNewTab}
            />
          ))}
        </div>
      }
      rightContent={
        <div className="flex gap-x-2">
          <div className="flex items-center text-xs justify-center">
            <Link
              href={getChangelogUrl(CURRENT_RELEASE.commit)}
              text={`${t(
                translations.footer.buildID,
              )} ${CURRENT_RELEASE.commit?.substring(0, 7)}`}
              openNewTab={true}
            />
          </div>
          <SocialLinks dataAttribute="footer-social" />
        </div>
      }
    />
  );
};
