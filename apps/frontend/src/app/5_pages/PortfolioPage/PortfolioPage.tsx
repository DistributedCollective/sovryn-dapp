import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';

const PortfolioPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.portfolioPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mt-12 mb-7">
      <div className="grid grid-cols-3 gap-20 w-full mb-6">
        <div className="col-span-2 md:col-span-1 md:bg-gray-90 rounded md:py-7 md:px-6">
          Total Value Section
        </div>
        <div className="col-span-2 md:bg-gray-90 rounded md:py-7 md:px-6">
          Balances
        </div>
      </div>
    </div>
  </>
);

export default PortfolioPage;
