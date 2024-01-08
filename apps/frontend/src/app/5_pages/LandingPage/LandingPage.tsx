import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';
import { Banner } from './components/Banner/Banner';
import { QuickLaunch } from './components/QuickLaunch/QuickLaunch';

const pageTranslations = translations.landingPage;

const LandingPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
        <meta
          name="description"
          content={t(pageTranslations.meta.description)}
        />
      </Helmet>

      <div className="container max-w-screen-xl mx-auto mb-4 mt-10">
        <div className="flex flex-col lg:flex-row mb-10">
          <div className="flex-1 min-h-40">Welcome section</div>
          <div className="min-h-40 w-full lg:max-w-[26rem] flex justify-end">
            <Banner />
          </div>
        </div>

        <QuickLaunch />

        <div className="grid xl:grid-cols-2 mb-10">
          <div>How to get started section</div>
          <div className="py-8 px-6 rounded bg-gray-90">FAQ section</div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
