import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button, ButtonSize, Heading, Link, Paragraph } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { CAMPAIGN_URL } from './LeaderboardPointsPage.constants';
import { LeaderboardPointsFrame } from './components/LeaderboardPointsFrame/LeaderboardPointsFrame';

const LeaderboardPointsPage: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{t(translations.leaderboardPointsPage.meta.title)}</title>
      </Helmet>

      <div className="w-full flex flex-col items-center text-gray-10 mt-9 mb-14 md:px-20">
        <Heading className="text-center mb-9 lg:text-2xl">
          {t(translations.leaderboardPointsPage.title)}
        </Heading>

        <Paragraph className="text-center mb-6 lg:mb-6 text-xs leading-5 max-w-md">
          <Trans
            i18nKey={t(translations.leaderboardPointsPage.claimWarning)}
            components={[<strong>date</strong>, <strong>date</strong>]}
          />
        </Paragraph>

        <div className="flex lg:flex-row flex-col items-center justify-center max-w-md">
          <Button
            text={t(translations.leaderboardPointsPage.claimLp)}
            className="sm:mr-4 sm:mb-0 mr-0 mb-6"
            onClick={() => navigate('/claim-lp')}
            size={ButtonSize.large}
          />
          <Link
            href={CAMPAIGN_URL}
            text={t(translations.leaderboardPointsPage.aboutCampaign)}
          />
        </div>

        <div className="w-full md:bg-gray-90 md:py-7 md:px-6 rounded lg:mt-14 mt-7">
          <LeaderboardPointsFrame />
        </div>
      </div>
    </>
  );
};

export default LeaderboardPointsPage;
