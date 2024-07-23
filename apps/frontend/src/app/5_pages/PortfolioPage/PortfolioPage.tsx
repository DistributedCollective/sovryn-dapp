import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { TokenPricesProvider } from '../../../contexts/TokenPricesContext';
import { translations } from '../../../locales/i18n';
import { AssetSection } from './components/AssetSection/AssetSection';
import { ProtocolSection } from './components/ProtocolSection/ProtocolSection';

const PortfolioPage: FC = () => (
  <TokenPricesProvider>
    <Helmet>
      <title>{t(translations.portfolioPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mt-4 md:mt-12 mb-7">
      <div className="grid grid-cols-9 items-start gap-10 md:gap-12 lg:gap-20 w-full mb-6">
        <div className="col-span-9 md:col-span-4 lg:col-span-3 md:bg-gray-90 rounded md:py-7 md:px-6">
          <ProtocolSection />
        </div>
        <div className="col-span-9 md:col-span-5 lg:col-span-6 md:bg-gray-90 rounded md:py-7 md:px-6">
          <AssetSection />
        </div>
      </div>
    </div>
  </TokenPricesProvider>
);

export default PortfolioPage;
