import React, { FC } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../locales/i18n';

export const SocialLeaderboard: FC = () => {
  return (
    <div className="p-4">
      <div className="mt-4 text-sm font-medium text-gray-30 text-end">
        {t(translations.leaderboardPage.tables.social.pointsInfo)}
      </div>

      <div className="flex flex-row justify-center mt-8">
        <iframe
          src="https://gleam.io/2Pqut/tiltom-test"
          title="competition"
          className="rounded w-[30.25rem] h-[30.75rem]"
        ></iframe>
      </div>

      <div className="flex flex-row justify-center mb-8">
        <iframe
          src="https://gleam.io/2Pqut/leaderboard"
          title="leaderboard"
          id="leaderboard"
          className="rounded-b w-[30.25rem] h-[31.25rem]"
        ></iframe>
      </div>
    </div>
  );
};
