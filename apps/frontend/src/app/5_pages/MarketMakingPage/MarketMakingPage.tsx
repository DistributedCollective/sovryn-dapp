import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { SupportedTokens } from '@sovryn/contracts';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { PromoCard } from '../../2_molecules/PromoCard/PromoCard';
import { getTokenDisplayName } from '../../../constants/tokens';
import { translations } from '../../../locales/i18n';

const MarketMakingPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.marketMakingPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mt-4 mb-7">
      <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded mb-6">
        <PromoCard
          asset1={SupportedTokens.bpro}
          asset2={SupportedTokens.rbtc}
          label1={t('promotion.weeklyRewards')}
          child1={
            <AmountRenderer
              value="15000"
              suffix={getTokenDisplayName(SupportedTokens.sov)}
              isAnimated
              precision={0}
            />
          }
          label2={t(translations.promotion.currentAPY)}
          child2={
            <AmountRenderer value="7.06" suffix="%" isAnimated precision={2} />
          }
        />
      </div>
    </div>
  </>
);

export default MarketMakingPage;
