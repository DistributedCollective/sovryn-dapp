import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle, Paragraph } from '@sovryn/ui';

import borrowBg from '../../../../../assets/images/QuickLaunch/borrow_bg.svg';
import earnBg from '../../../../../assets/images/QuickLaunch/earn_bg.svg';
import lendBg from '../../../../../assets/images/QuickLaunch/lend_bg.svg';
import stakeBg from '../../../../../assets/images/QuickLaunch/stake_bg.svg';
import { translations } from '../../../../../locales/i18n';
import { formatValue } from '../../../../../utils/math';
import { useGetNextSupplyInterestRate } from '../../../LendPage/hooks/useGetNextSupplyInterestRate';
import { useGetReturnRates } from '../../../MarketMakingPage/hooks/useGetReturnRates';
import { useGetStakingStatistics } from '../../../StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';

const pageTranslations = translations.landingPage;

export const QuickLaunch: FC = () => {
  const navigate = useNavigate();
  const { maxStakingApr } = useGetStakingStatistics();
  const { interestRate } = useGetNextSupplyInterestRate(COMMON_SYMBOLS.DLLR);
  const { rates } = useGetReturnRates();

  const maxRate = useMemo(() => {
    let maxRewards = '0';
    rates.forEach(rate => {
      if (Number(rate.afterRewards) > Number(maxRewards)) {
        maxRewards = rate.afterRewards;
      }
    });

    return maxRewards;
  }, [rates]);

  const options = [
    {
      title: t(pageTranslations.quickLaunch.stake.title, {
        amount: formatValue(maxStakingApr, 2),
      }),
      description: t(pageTranslations.quickLaunch.stake.description),
      action: t(pageTranslations.quickLaunch.stake.action),
      url: () => navigate('/earn/staking'),
      backgroundImage: stakeBg,
    },
    {
      title: t(pageTranslations.quickLaunch.earn.title, {
        amount: formatValue(maxRate, 2),
      }),
      description: t(pageTranslations.quickLaunch.earn.description),
      action: t(pageTranslations.quickLaunch.earn.action),
      url: () => navigate('/earn/market-making'),
      backgroundImage: earnBg,
    },
    {
      title: t(pageTranslations.quickLaunch.lend.title, {
        amount: formatValue(interestRate, 2),
      }),
      description: t(pageTranslations.quickLaunch.lend.description),
      action: t(pageTranslations.quickLaunch.lend.action),
      url: () => navigate('/earn/lend'),
      backgroundImage: lendBg,
    },
    {
      title: t(pageTranslations.quickLaunch.borrow.title),
      description: t(pageTranslations.quickLaunch.borrow.description),
      action: t(pageTranslations.quickLaunch.borrow.action),
      url: () => navigate('/borrow/fixed-interest'),
      backgroundImage: borrowBg,
    },
  ];

  return (
    <div className="bg-gray-80 rounded min-h-72 md:p-6 p-4 sm:mb-14 mb-10 grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 gap-4">
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
            onClick={option.url}
            style={ButtonStyle.secondary}
          />
        </div>
      ))}
    </div>
  );
};
