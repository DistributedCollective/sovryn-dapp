import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import { CTA } from '../../../../2_molecules/CTA/CTA';
import socialBg from '../../../../../assets/images/Leaderboard/social.svg';
import stakeBg from '../../../../../assets/images/Leaderboard/stake.svg';
import tradeBg from '../../../../../assets/images/Leaderboard/trade.svg';
import { translations } from '../../../../../locales/i18n';

const baseTranslation = translations.leaderboardPage.ctaLinksSection;

export const CTALinks: FC = () => {
  const navigate = useNavigate();

  const options = useMemo(
    () => [
      {
        title: t(baseTranslation.stake.title),
        description: t(baseTranslation.stake.description),
        action: t(baseTranslation.stake.cta),
        url: () => navigate('/earn/staking'),
        backgroundImage: stakeBg,
      },
      {
        title: t(baseTranslation.trade.title),
        description: t(baseTranslation.trade.description),
        action: t(baseTranslation.trade.cta),
        url: () =>
          (window.location.href = 'https://app.babelfish.money/convert'),
        backgroundImage: tradeBg,
      },
      {
        title: t(baseTranslation.social.title),
        description: t(baseTranslation.social.description),
        action: t(baseTranslation.social.cta),
        url: () => navigate('/earn/staking'),
        backgroundImage: socialBg,
      },
    ],
    [navigate],
  );

  return (
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
  );
};
