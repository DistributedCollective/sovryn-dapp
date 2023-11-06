import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { SupportedTokens } from '@sovryn/contracts';

import { PromoCard } from '../../2_molecules/PromoCard/PromoCard';
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
          rewards="15000"
          rewardsLabel={t('promotion.weeklyRewards')}
          apy="7.06"
          rewardToken={SupportedTokens.sov}
        />
      </div>
    </div>
  </>
);

export default MarketMakingPage;
