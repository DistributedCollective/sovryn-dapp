import React, { FC, useRef } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';
import { ProtocolData } from './components/ProtocolData/ProtocolData';
import { QuickLaunch } from './components/QuickLaunch/QuickLaunch';
import { TitleSection } from './components/TitleSection/TitleSection';

const pageTranslations = translations.landingPage;

const LandingPage: FC = () => {
  const gettingStartedRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
        <meta
          name="description"
          content={t(pageTranslations.meta.description)}
        />
      </Helmet>

      <div className="container max-w-screen-xl mx-auto mt-10 mb-20">
        <div className="grid xl:grid-cols-2 mb-10">
          <div>
            <TitleSection ctaRef={gettingStartedRef} />
            <ProtocolData />
          </div>

          <div className="min-h-40 flex justify-end">Banner section</div>
        </div>

        <QuickLaunch />

        <div className="grid xl:grid-cols-2 mb-10">
          <div ref={gettingStartedRef}>How to get started section</div>
          <div className="py-8 px-6 rounded bg-gray-90">FAQ section</div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
