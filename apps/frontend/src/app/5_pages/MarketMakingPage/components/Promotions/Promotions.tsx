import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Paragraph, ParagraphSize, Button, ButtonStyle } from '@sovryn/ui';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { BannersCarousel } from '../../../../2_molecules/BannersCarousel/BannersCarousel';
import { PromoCard } from '../../../../2_molecules/PromoCard/PromoCard';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { translations } from '../../../../../locales/i18n';
import { useGetPromotionsData } from '../../hooks/useGetPromotionsData';

type PoolsTableProps = {
  setActivePool: (poolKey: string) => void;
  onClick?: (value: boolean) => void;
};

export const Promotions: FC<PoolsTableProps> = ({ setActivePool, onClick }) => {
  const { data, loading } = useGetPromotionsData();

  const handleClick = useCallback(
    (poolKey: string) => {
      setActivePool(poolKey);
      onClick?.(true);
    },
    [setActivePool, onClick],
  );

  return (
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
      <BannersCarousel
        className={`${data.length > 1 ? '-mx-4' : '-ml-4'} sm:mx-2`}
      >
        {!loading &&
          data.map(item => (
            <PromoCard
              key={item.asset1}
              asset1={item.asset1}
              asset2={item.asset2}
              label1={t('promotion.weeklyRewards')}
              child1={
                <AmountRenderer
                  value={item.rewardAmount}
                  suffix={getTokenDisplayName(SupportedTokens.sov)}
                  isAnimated
                  precision={0}
                />
              }
              label2={t(translations.promotion.currentAPY)}
              child2={
                <AmountRenderer
                  value={item.apy}
                  suffix="%"
                  isAnimated
                  precision={2}
                />
              }
              onClick={() => handleClick(item.pool?.key || '')}
            />
          ))}
      </BannersCarousel>
    </div>
  );
};
