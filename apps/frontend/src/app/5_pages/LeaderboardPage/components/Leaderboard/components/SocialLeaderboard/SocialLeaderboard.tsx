import React, { FC } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { translations } from '../../../../../../../locales/i18n';
import {
  COMPETITION_URL,
  LEADERBOARD_URL,
} from './SocialLeaderboard.constants';

export const SocialLeaderboard: FC = () => {
  return (
    <div className="p-4">
      <div className="mt-4 text-sm font-medium text-gray-30 text-end">
        {t(translations.leaderboardPage.tables.social.pointsInfo)}
      </div>
      <div className="flex flex-col mt-8">
        <div className="flex flex-row justify-center">
          <Trans
            i18nKey={t(translations.leaderboardPage.tables.social.joinSquad)}
            components={[
              <a
                href="https://t.me/SovSquad"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1"
              >
                Sov Squad
              </a>,
            ]}
          />
        </div>
        <div className="flex flex-row justify-center">
          <iframe
            src={COMPETITION_URL}
            title="competition"
            className="rounded w-[30.25rem] h-[30.75rem]"
          ></iframe>
        </div>
      </div>

      <div className="flex flex-row justify-center mb-8">
        <iframe
          src={LEADERBOARD_URL}
          title="leaderboard"
          id="leaderboard"
          className="rounded-b w-[30.25rem] h-[31.25rem]"
        ></iframe>
      </div>
    </div>
  );
};
