import React, { FC, useRef, useState } from 'react';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
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
      <NetworkBanner
        requiredChainId={RSK_CHAIN_ID}
        childClassName="flex items-center flex-col "
      >
        <Intro pointsSectionRef={pointsSectionRef} />
        <CTALinks tableRef={tableRef} setTabIndex={setTabIndex} />
        <Leaderboard
          index={tabIndex}
          setIndex={setTabIndex}
          tableRef={tableRef}
        />
        <PointsSection pointsSectionRef={pointsSectionRef} />
      </NetworkBanner>
    </div>
  );
};

export default LeaderboardPage;
