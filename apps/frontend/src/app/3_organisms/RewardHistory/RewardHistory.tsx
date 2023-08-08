import React, { FC, useCallback, useState } from 'react';

import { RewardHistoryType } from './RewardHistory.types';
import { RewardsEarnedHistory } from './components/RewardsEarnedHistory/RewardsEarnedHistory';
import { StabilityPoolRewards } from './components/StabilityPoolRewards/StabilityPoolRewards';
import { StabilityPoolSubsidies } from './components/StabilityPoolSubsidies/StabilityPoolSubsidies';

export const RewardHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    RewardHistoryType.stabilityPoolRewards,
  );

  const onChangeRewardHistory = useCallback((value: RewardHistoryType) => {
    setSelectedHistoryType(value);
  }, []);

  return (
    <>
      {selectedHistoryType === RewardHistoryType.stabilityPoolRewards && (
        <StabilityPoolRewards
          selectedHistoryType={selectedHistoryType}
          onChangeRewardHistory={onChangeRewardHistory}
        />
      )}
      {selectedHistoryType === RewardHistoryType.stabilityPoolSubsidies && (
        <StabilityPoolSubsidies
          selectedHistoryType={selectedHistoryType}
          onChangeRewardHistory={onChangeRewardHistory}
        />
      )}
      {[
        RewardHistoryType.stakingRevenue,
        RewardHistoryType.stakingSubsidies,
      ].includes(selectedHistoryType) && (
        <RewardsEarnedHistory
          selectedHistoryType={selectedHistoryType}
          onChangeRewardHistory={onChangeRewardHistory}
        />
      )}
    </>
  );
};
