import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonStyle } from '@sovryn/ui';

import { CTA } from '../../2_molecules/CTA/CTA';
import socialBg from '../../../assets/images/Leaderboard/social.svg';
import stakeBg from '../../../assets/images/Leaderboard/stake.svg';
import tradeBg from '../../../assets/images/Leaderboard/trade.svg';
import { translations } from '../../../locales/i18n';
import { PointsSection } from './components/PointsSection/PointsSection';

const baseTranslation = translations.leaderboardPage;
const ctaLinksTranslation = translations.leaderboardPage.ctaLinksSection;

const LeaderboardPage: FC = () => {
  const navigate = useNavigate();

  const options = useMemo(
    () => [
      {
        title: t(ctaLinksTranslation.stake.title),
        description: t(ctaLinksTranslation.stake.description),
        action: t(ctaLinksTranslation.stake.cta),
        url: () => navigate('/earn/staking'),
        backgroundImage: stakeBg,
      },
      {
        title: t(ctaLinksTranslation.trade.title),
        description: t(ctaLinksTranslation.trade.description),
        action: t(ctaLinksTranslation.trade.cta),
        url: () =>
          (window.location.href = 'https://app.babelfish.money/convert'),
        backgroundImage: tradeBg,
      },
      {
        title: t(ctaLinksTranslation.social.title),
        description: t(ctaLinksTranslation.social.description),
        action: t(ctaLinksTranslation.social.cta),
        url: () => navigate('/earn/staking'),
        backgroundImage: socialBg,
      },
    ],
    [navigate],
  );

  return (
    <div className="w-full flex items-center flex-col px-0 md:px-20">
      <div className="w-full md:w-[26rem] text-center">
        <div className="text-2xl font-medium mt-9">
          {t(baseTranslation.title)}
        </div>
        <div className="text-sm font-semibold mt-4">
          {t(baseTranslation.subtitle)}
        </div>
        <div className="text-sm font-medium mt-6">
          {t(baseTranslation.description)}
        </div>

        <div className="mt-4">
          <Button
            text={t(baseTranslation.primaryCta)}
            style={ButtonStyle.secondary}
            className="mr-4"
          />
          <Button
            text={t(baseTranslation.secondaryCta)}
            style={ButtonStyle.ghost}
          />
        </div>

        <div className="mt-11">
          <div className="text-2xl font-medium mt-9">
            {t(ctaLinksTranslation.title)}
          </div>
          <div className="text-sm font-semibold mt-4">
            {t(ctaLinksTranslation.subtitle)}
          </div>
        </div>
      </div>

      <div className="w-full p-4 sm:p-6 sm:w-3/4 mt-8 bg-gray-80 rounded min-h-64 grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:gap-6 gap-4">
        {options.map(
          ({ backgroundImage, title, description, action, url }, index) => (
            <CTA
              index={index}
              backgroundImage={backgroundImage}
              title={title}
              description={description}
              action={action}
              navigateTo={url}
            />
          ),
        )}
      </div>

      <PointsSection />
    </div>
  );
};

export default LeaderboardPage;
