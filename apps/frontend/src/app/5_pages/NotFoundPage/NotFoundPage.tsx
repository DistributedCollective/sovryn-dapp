import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';

import { Header, Heading, Link, Paragraph } from '@sovryn/ui';

import { SovrynLogo } from '../../2_molecules';
import { Footer } from '../../3_organisms';
import { translations } from '../../../locales/i18n';

export const NotFoundPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.notFoundPage.meta.title)}</title>
    </Helmet>
    <>
      <Header
        logo={<SovrynLogo dataAttribute="header-logo" link="/" />}
        menuIcon={<SovrynLogo dataAttribute="header-logo" link="/" />}
      />
      <div className="container flex flex-col flex-grow items-center justify-center">
        <Heading className="font-medium text-2xl mb-10 lg:mb-12 text-center">
          {t(translations.notFoundPage.title)}
        </Heading>
        <Paragraph className="max-w-xl font-normal text-sm lg:text-base text-center lg:px-4">
          <Trans
            i18nKey={translations.notFoundPage.description}
            components={[
              <Link
                className="leading-tight font-normal text-sm lg:text-base text-center"
                text={window.location.hostname}
                href="/"
                openNewTab={false}
              />,
            ]}
          />
        </Paragraph>
      </div>
    </>
    <div className="shrink">
      <Footer showDashboardLink />
    </div>
  </>
);
