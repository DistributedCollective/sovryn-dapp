import React, { FC } from 'react';

import { CTALinks } from './components/CTALinks/CTALinks';
import { Intro } from './components/Intro/Intro';
import { Leaderboard } from './components/Leaderboard/Leaderboard';
import { PointsSection } from './components/PointsSection/PointsSection';

const LeaderboardPage: FC = () => {
  return (
    <div className="w-full flex items-center flex-col px-0 md:px-20">
      <Intro />
      <CTALinks />
      <Leaderboard />
      <PointsSection />
    </div>
  );
};

export default LeaderboardPage;
