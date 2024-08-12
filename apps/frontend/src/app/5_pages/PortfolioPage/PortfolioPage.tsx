import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';
import { AssetSection } from './components/AssetSection/AssetSection';
import { ProtocolSection } from './components/ProtocolSection/ProtocolSection';

const PortfolioPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.portfolioPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container xl:mx-9 mx-0.25 md:mb-2 mt-4 md:mt-12 mb-7">
      <div className="grid grid-cols-9 items-start gap-4 2xl:gap-12 3xl:gap-20 w-full mb-6">
        <div className="col-span-9 md:col-span-4 lg:col-span-3 md:bg-gray-90 rounded md:py-7 md:px-2 xl:px-6">
          <ProtocolSection />
        </div>
        <div className="col-span-9 md:col-span-5 lg:col-span-6 md:bg-gray-90 rounded md:py-7 md:px-2 xl:px-6">
          <AssetSection />
        </div>
      </div>
    </div>
  </>
);

export default PortfolioPage;
