import React, { FC } from 'react';

export const SocialLeaderboard: FC = () => {
  return (
    <>
      <div className="flex flex-row justify-center mt-8">
        <iframe
          src="https://gleam.io/2Pqut/tiltom-test"
          title="competition"
          width="484"
          height="440"
        ></iframe>
      </div>

      <div className="flex flex-row justify-center mb-8">
        <iframe
          src="https://gleam.io/2Pqut/leaderboard"
          title="leaderboard"
          id="leaderboard"
          width="484"
          height="500"
        ></iframe>
      </div>
    </>
  );
};
