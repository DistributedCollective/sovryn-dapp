import React, { FC } from 'react';

export const SocialLeaderboard: FC = () => {
  return (
    <>
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
    </>
  );
};
