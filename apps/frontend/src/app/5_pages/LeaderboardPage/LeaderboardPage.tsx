import React, { FC, useRef, useState } from 'react';

import { CTALinks } from './components/CTALinks/CTALinks';
import { Intro } from './components/Intro/Intro';
import { Leaderboard } from './components/Leaderboard/Leaderboard';
import { PointsSection } from './components/PointsSection/PointsSection';

const LeaderboardPage: FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const pointsSectionRef = useRef<HTMLDivElement>(null);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="w-full flex items-center flex-col px-0 md:px-20">
      <Intro pointsSectionRef={pointsSectionRef} />
      <CTALinks tableRef={tableRef} setTabIndex={setTabIndex} />
      <Leaderboard
        index={tabIndex}
        setIndex={setTabIndex}
        tableRef={tableRef}
      />
      <PointsSection pointsSectionRef={pointsSectionRef} />
    </div>
  );
};

export default LeaderboardPage;
