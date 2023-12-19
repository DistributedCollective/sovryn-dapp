import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';

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

      <div className="container max-w-screen-xl mx-auto my-4">
        <div className="grid xl:grid-cols-2 mb-10">
          <div className="min-h-40">Welcome section</div>
          <div className="min-h-40 flex justify-end">Banner section</div>
        </div>

        <div className="bg-gray-80 rounded min-h-72 p-6 mb-10">
          Quick launch section
        </div>

        <div className="grid xl:grid-cols-2 mb-10">
          <div>How to get started section</div>
          <div className="py-8 px-6 rounded bg-gray-90">FAQ section</div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
