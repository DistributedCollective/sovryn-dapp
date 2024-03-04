import React, { FC } from 'react';

import {
  COMPETITION_URL,
  LEADERBOARD_URL,
} from './SocialLeaderboard.constants';

export const SocialLeaderboard: FC = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col mt-8">
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
