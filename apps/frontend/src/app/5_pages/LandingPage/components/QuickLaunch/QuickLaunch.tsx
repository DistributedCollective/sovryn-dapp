import React, { FC, useMemo } from 'react';

import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import borrowBg from '../../../../../assets/images/QuickLaunch/borrow_bg.svg';
import earnBg from '../../../../../assets/images/QuickLaunch/earn_bg.svg';
import lendBg from '../../../../../assets/images/QuickLaunch/lend_bg.svg';
import stakeBg from '../../../../../assets/images/QuickLaunch/stake_bg.svg';
import { translations } from '../../../../../locales/i18n';
import { formatValue } from '../../../../../utils/math';
import { useGetNextSupplyInterestRate } from '../../../LendPage/hooks/useGetNextSupplyInterestRate';
import { useGetReturnRate } from '../../../MarketMakingPage/hooks/useGetReturnRate';
import { AmmLiquidityPoolDictionary } from '../../../MarketMakingPage/utils/AmmLiquidityPoolDictionary';
import { useGetStakingStatistics } from '../../../StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';

const pageTranslations = translations.landingPage;
const ammPools = AmmLiquidityPoolDictionary.list();

export const QuickLaunch: FC = () => {
  const sovPool = useMemo(
    () =>
      ammPools.find(pool => pool.assetA === SupportedTokens.sov) || ammPools[0],
    [],
  );
  const { maxStakingApr } = useGetStakingStatistics();
  const { interestRate } = useGetNextSupplyInterestRate(SupportedTokens.dllr);
  const { returnRates } = useGetReturnRate(sovPool.converter);

  const options = [
    {
      title: t(pageTranslations.quickLaunch.stake.title, {
        amount: formatValue(maxStakingApr, 2),
      }),
      description: t(pageTranslations.quickLaunch.stake.description),
      action: t(pageTranslations.quickLaunch.stake.action),
      url: '/earn/staking',
      backgroundImage: stakeBg,
    },
    {
      title: t(pageTranslations.quickLaunch.earn.title, {
        amount: formatValue(returnRates.afterRewards, 2),
      }),
      description: t(pageTranslations.quickLaunch.earn.description),
      action: t(pageTranslations.quickLaunch.earn.action),
      url: '/earn/market-making',
      backgroundImage: earnBg,
    },
    {
      title: t(pageTranslations.quickLaunch.lend.title, {
        amount: formatValue(interestRate, 2),
      }),
      description: t(pageTranslations.quickLaunch.lend.description),
      action: t(pageTranslations.quickLaunch.lend.action),
      url: '/earn/lend',
      backgroundImage: lendBg,
    },
    {
      title: t(pageTranslations.quickLaunch.borrow.title),
      description: t(pageTranslations.quickLaunch.borrow.description),
      action: t(pageTranslations.quickLaunch.borrow.action),
      url: '/borrow/fixed-interest',
      backgroundImage: borrowBg,
    },
  ];

  return (
    <div className="bg-gray-80 rounded min-h-72 md:p-6 p-4 sm:mb-14 mb-12 grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 gap-4">
      {options.map((option, index) => (
        <div
          key={index}
          className="relative p-4 md:p-6 bg-gray-70 rounded flex flex-col md:items-start justify-end md:min-h-60 min-h-40"
        >
          <img
            src={option.backgroundImage}
            alt={option.title}
            className="absolute top-0 right-0 md:max-w-none max-w-14"
          />
          <Paragraph
            className="mb-6 font-medium text-sm xl:max-w-36 xl:pr-0 pr-12"
            children={option.title}
          />
          <Paragraph
            className="mb-4 md:mb-6 font-medium xl:pr-0 pr-12 text-gray-30"
            children={option.description}
          />
          <Button
            className="w-full sm:w-auto"
            text={option.action}
            href={option.url}
            style={ButtonStyle.secondary}
          />
        </div>
      ))}
    </div>
  );
};
