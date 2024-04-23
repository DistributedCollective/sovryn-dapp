import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Chains } from '../../../../../config/chains';

import { CTA } from '../../../../2_molecules/CTA/CTA';
import borrowBg from '../../../../../assets/images/QuickLaunch/borrow_bg.svg';
import earnBg from '../../../../../assets/images/QuickLaunch/earn_bg.svg';
import lendBg from '../../../../../assets/images/QuickLaunch/lend_bg.svg';
import stakeBg from '../../../../../assets/images/QuickLaunch/stake_bg.svg';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { formatValue } from '../../../../../utils/math';
import { useGetNextSupplyInterestRate } from '../../../LendPage/hooks/useGetNextSupplyInterestRate';
import { useGetReturnRates } from '../../../MarketMakingPage/hooks/useGetReturnRates';
import { useGetStakingStatistics } from '../../../StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';

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
      badges: [Chains.RSK],
    },
    {
      title: t(pageTranslations.quickLaunch.earn.title, {
        amount: formatValue(maxRate, 2),
      }),
      description: t(pageTranslations.quickLaunch.earn.description),
      action: t(pageTranslations.quickLaunch.earn.action),
      url: () => navigate('/earn/market-making'),
      backgroundImage: earnBg,
      badges: [Chains.RSK, Chains.BOB],
    },
    {
      title: t(pageTranslations.quickLaunch.lend.title, {
        amount: formatValue(interestRate, 2),
      }),
      description: t(pageTranslations.quickLaunch.lend.description),
      action: t(pageTranslations.quickLaunch.lend.action),
      url: () => navigate('/earn/lend'),
      backgroundImage: lendBg,
      badges: [Chains.RSK],
    },
    {
      title: t(pageTranslations.quickLaunch.borrow.title),
      description: t(pageTranslations.quickLaunch.borrow.description),
      action: t(pageTranslations.quickLaunch.borrow.action),
      url: () => navigate('/borrow/fixed-interest'),
      backgroundImage: borrowBg,
      badges: [Chains.RSK],
    },
  ];

  return (
    <div className="bg-gray-80 rounded min-h-72 md:p-6 p-4 sm:mb-14 mb-10 grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 gap-4">
      {options.map((option, index) => (
        <CTA
          key={index}
          index={index}
          backgroundImage={option.backgroundImage}
          title={option.title}
          description={option.description}
          action={option.action}
          navigateTo={option.url}
          badges={option.badges}
        />
      ))}
    </div>
  );
};
