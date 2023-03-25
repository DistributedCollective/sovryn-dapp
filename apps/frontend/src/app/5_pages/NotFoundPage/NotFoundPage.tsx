import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';

import { Header, Link } from '@sovryn/ui';

import { ErrorRenderer } from '../../1_atoms/ErrorRenderer/ErrorRenderer';
import { SovrynLogo } from '../../2_molecules';
import { Footer } from '../../3_organisms';
import { translations } from '../../../locales/i18n';

export const NotFoundPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.notFoundPage.meta.title)}</title>
    </Helmet>
    <Header
      logo={<SovrynLogo dataAttribute="header-logo" link="/" />}
      menuIcon={<SovrynLogo dataAttribute="header-logo" link="/" />}
    />

    <ErrorRenderer
      animation="spaceScene"
      title={t(translations.notFoundPage.title)}
      description={
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
      }
    />
    <div className="shrink">
      <Footer showDashboardLink />
    </div>
  </>
);
