import React, { FC } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, ParagraphSize, Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BannersCarousel } from '../../../../2_molecules/BannersCarousel/BannersCarousel';
import { PromoCard } from '../../../../2_molecules/PromoCard/PromoCard';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';

export const Promotions: FC = () => (
  <div className="w-full md:bg-gray-90 rounded md:py-7">
    <div className="md:px-6">
      <Paragraph className="mb-1 text-gray-30" size={ParagraphSize.base}>
        {t(translations.marketMakingPage.promotions.p1)}
      </Paragraph>
      <Paragraph className="mb-6 text-gray-30" size={ParagraphSize.base}>
        {t(translations.marketMakingPage.promotions.p2)}
        <Button
          text={t(translations.stakePage.stakingRewards.learnMoreLink)}
          href={''}
          className="ml-1"
          style={ButtonStyle.ghost}
          hrefExternal
        />
      </Paragraph>
    </div>
    <BannersCarousel className="-mx-4 md:mx-2">
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
      <PromoCard
        asset1={SupportedTokens.dllr}
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

      <PromoCard
        asset1={SupportedTokens.doc}
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

      <PromoCard
        asset1={SupportedTokens.eths}
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

      <PromoCard
        asset1={SupportedTokens.doc}
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
    </BannersCarousel>
  </div>
);
