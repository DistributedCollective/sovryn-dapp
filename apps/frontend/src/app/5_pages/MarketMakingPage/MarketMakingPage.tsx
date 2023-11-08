import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { PoolsTable } from './components/PoolsTable/PoolsTable';
import { Promotions } from './components/Promotions/Promotions';

const MarketMakingPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.marketMakingPage.meta.title)}</title>
    </Helmet>

    <div className="w-full flex flex-col items-center text-gray-10 mt-6 sm:mt-24 max-w-6xl">
      <Heading className="text-center mb-1 lg:mb-3 text-base lg:text-2xl">
        {t(translations.marketMakingPage.title)}
      </Heading>

      <Paragraph
        className="text-center mb-6 lg:mb-10"
        size={ParagraphSize.base}
      >
        {t(translations.marketMakingPage.subtitle)}
      </Paragraph>

      <Promotions />

      <PoolsTable />
    </div>
  </>
);

export default MarketMakingPage;
