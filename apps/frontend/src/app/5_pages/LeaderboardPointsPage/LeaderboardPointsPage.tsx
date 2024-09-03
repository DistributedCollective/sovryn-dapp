import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Heading,
  Paragraph,
} from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { LeaderboardPoints } from './components/LeaderboardPoints/LeaderboardPoints';

const LeaderboardPointsPage: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{t(translations.leaderboardPointsPage.meta.title)}</title>
      </Helmet>

      <div className="w-full flex flex-col items-center text-gray-10 mt-9 mb-14 md:px-20">
        <Heading className="text-center lg:text-2xl">
          {t(translations.leaderboardPointsPage.title)}
        </Heading>

        <Paragraph className="font-medium text-center my-6 text-xs leading-5 max-w-xl">
          {t(translations.leaderboardPointsPage.description1)}
        </Paragraph>
        <Paragraph className="font-medium text-center mb-10 text-xs leading-5 max-w-xl">
          <Trans
            i18nKey={t(translations.leaderboardPointsPage.description2)}
            components={[
              <Button
                text="BOB Fusion"
                style={ButtonStyle.ghost}
                href="https://app.gobob.xyz/sign-up?refCode=u0i6lk"
                hrefExternal
              />,
              <Button
                text="Market Making"
                style={ButtonStyle.ghost}
                onClick={() => navigate('/earn/market-making')}
              />,
              <Button
                text="Staking SOV"
                style={ButtonStyle.ghost}
                onClick={() => navigate('/earn/staking')}
              />,
            ]}
          />
        </Paragraph>

        <div className="md:bg-gray-90 flex flex-col items-center justify-center max-w-xl px-3 py-4">
          <Paragraph className="font-medium text-center mb-6 text-xs leading-5 max-w-xl">
            {t(translations.leaderboardPointsPage.claimDescription)}
          </Paragraph>
          <Button
            text={t(translations.leaderboardPointsPage.claimLp)}
            onClick={() => navigate('/claim-lp')}
            size={ButtonSize.small}
          />
        </div>

        <div className="w-full md:bg-gray-90 md:pb-7 md:px-6 rounded lg:mt-7 mt-7">
          <Paragraph className="text-2xl font-medium m-2 md:m-8 md:mt-10">
            {t(translations.leaderboardPointsPage.leaderboard)}
          </Paragraph>

          <LeaderboardPoints />
        </div>
      </div>
    </>
  );
};

export default LeaderboardPointsPage;
