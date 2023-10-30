import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';

const MarketMakingPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.marketMakingPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mt-4 mb-7">
      <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-6">
        content
      </div>
    </div>
  </>
);

export default MarketMakingPage;
