import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import Carousel from 'react-multi-carousel';
import { useNavigate } from 'react-router-dom';

import { noop } from '@sovryn/ui';

import { Chains } from '../../../../../config/chains';

import { CTA } from '../../../../2_molecules/CTA/CTA';
import borrowSovryn from '../../../../../assets/images/QuickLaunch/Borrow with Sovryn.svg';
import comingSoon from '../../../../../assets/images/QuickLaunch/Coming soon.svg';
import lendDLLR from '../../../../../assets/images/QuickLaunch/Lend DLLR.svg';
import passiveYield from '../../../../../assets/images/QuickLaunch/Passive yield.svg';
import stakeSOV from '../../../../../assets/images/QuickLaunch/Stake SOV.svg';
import tradeRunes from '../../../../../assets/images/QuickLaunch/Trade Runes.svg';
import zero from '../../../../../assets/images/QuickLaunch/Zero.png';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { isBobChain, isRskChain } from '../../../../../utils/chain';
import { formatValue } from '../../../../../utils/math';
import { useGetNextSupplyInterestRate } from '../../../LendPage/hooks/useGetNextSupplyInterestRate';
import { useGetStakingStatistics } from '../../../StakePage/components/StakingStatistics/hooks/useGetStakingStatistics';
import styles from './QuickLaunch.module.css';

const pageTranslations = translations.landingPage;

export const QuickLaunch: FC = () => {
  const navigate = useNavigate();
  const chainId = useCurrentChain();
  const { maxStakingApr } = useGetStakingStatistics();
  const { interestRate } = useGetNextSupplyInterestRate(COMMON_SYMBOLS.DLLR);

  const options = useMemo(
    () => [
      {
        title: t(pageTranslations.quickLaunch.zero.title, {
          amount: formatValue(maxStakingApr, 2),
        }),
        description: t(pageTranslations.quickLaunch.zero.description),
        action: t(pageTranslations.quickLaunch.zero.action),
        url: () => navigate('/borrow/line-of-credit'),
        backgroundImage: zero,
        imageClass: 'w-16 top-5 right-5',
        chains: [Chains.RSK],
      },
      {
        title: t(pageTranslations.quickLaunch.stake.title, {
          amount: formatValue(maxStakingApr, 2),
        }),
        description: t(pageTranslations.quickLaunch.stake.description),
        action: t(pageTranslations.quickLaunch.stake.action),
        url: () => navigate('/earn/staking'),
        backgroundImage: stakeSOV,
        chains: [Chains.RSK],
      },
      {
        title: t(pageTranslations.quickLaunch.lend.title, {
          amount: formatValue(interestRate, 2),
        }),
        description: t(pageTranslations.quickLaunch.lend.description),
        action: t(pageTranslations.quickLaunch.lend.action),
        url: () => navigate('/earn/lend'),
        backgroundImage: lendDLLR,
        chains: [Chains.RSK],
      },
      {
        title: t(pageTranslations.quickLaunch.borrow.title),
        description: t(pageTranslations.quickLaunch.borrow.description),
        action: t(pageTranslations.quickLaunch.borrow.action),
        url: () => navigate('/borrow/fixed-interest'),
        backgroundImage: borrowSovryn,
        chains: [Chains.RSK],
      },
      {
        title: t(pageTranslations.quickLaunch.stake_BOB.title),
        description: t(pageTranslations.quickLaunch.stake_BOB.description),
        action: t(pageTranslations.quickLaunch.stake_BOB.action),
        url: () => navigate('/earn/staking'),
        backgroundImage: stakeSOV,
        chains: [Chains.BOB],
      },
      {
        title: t(pageTranslations.quickLaunch.runes_BOB.title),
        description: t(pageTranslations.quickLaunch.runes_BOB.description),
        action: t(pageTranslations.quickLaunch.runes_BOB.action),
        url: () => navigate('/convert'),
        backgroundImage: tradeRunes,
        chains: [Chains.BOB],
      },
      {
        title: t(pageTranslations.quickLaunch.earnYield_BOB.title),
        description: t(pageTranslations.quickLaunch.earnYield_BOB.description),
        action: t(pageTranslations.quickLaunch.earnYield_BOB.action),
        url: () => navigate('/earn/market-making'),
        backgroundImage: passiveYield,
        chains: [Chains.BOB],
      },
      {
        title: t(pageTranslations.quickLaunch.soon_BOB.title),
        description: t(pageTranslations.quickLaunch.soon_BOB.description),
        action: t(pageTranslations.quickLaunch.soon_BOB.action),
        url: noop,
        backgroundImage: comingSoon,
        chains: [Chains.BOB],
        disable: true,
      },
    ],
    [interestRate, maxStakingApr, navigate],
  );

  const filteredOptions = useMemo(() => {
    if (isRskChain(chainId)) {
      return options.filter(item => item.chains?.includes(Chains.RSK));
    } else if (isBobChain(chainId)) {
      return options.filter(item => item.chains?.includes(Chains.BOB));
    } else return [];
  }, [options, chainId]);

  return (
    <div className="bg-gray-80 rounded min-h-72 md:p-6 p-4 md:px-3 md:pb-16 sm:mb-14 mb-10 relative w-full">
      <Carousel
        arrows={false}
        draggable
        partialVisible={false}
        focusOnSelect={false}
        responsive={{
          superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 4,
            slidesToSlide: 4,
          },
          desktop: {
            breakpoint: { max: 3000, min: 1280 },
            items: 4,
            slidesToSlide: 4,
          },
          tablet: {
            breakpoint: { max: 1280, min: 768 },
            items: 3,
            slidesToSlide: 3,
          },
          mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 1,
            slidesToSlide: 1,
          },
        }}
        minimumTouchDrag={80}
        swipeable
        className="static"
        renderDotsOutside
        showDots
        itemClass="px-3"
        autoPlay={false}
        dotListClass={styles.dot}
        autoPlaySpeed={15000}
        infinite={false}
      >
        {filteredOptions.map((option, index) => (
          <CTA
            key={index}
            index={index}
            backgroundImage={option.backgroundImage}
            title={option.title}
            description={option.description}
            action={option.action}
            // href={option.href}
            navigateTo={option.url}
            disableCTA={option.disable}
            imageClass={option.imageClass}
          />
        ))}
      </Carousel>
    </div>
  );
};
