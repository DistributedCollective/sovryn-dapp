import React, { FC, useCallback, useState } from 'react';

import { RewardHistoryType } from './RewardHistory.types';
import { RewardsEarnedHistory } from './components/RewardsEarnedHistory/RewardsEarnedHistory';
import { StabilityPoolRewards } from './components/StabilityPoolRewards/StabilityPoolRewards';
import { StabilityPoolSubsidies } from './components/StabilityPoolSubsidies/StabilityPoolSubsidies';
import { VestingRewards } from './components/VestingRewards/VestingRewards';

export const RewardHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    RewardHistoryType.liquidityMiningRewards,
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
        RewardHistoryType.liquidityMiningRewards,
        RewardHistoryType.stakingRevenue,
        RewardHistoryType.stakingSubsidies,
      ].includes(selectedHistoryType) && (
        <RewardsEarnedHistory
          selectedHistoryType={selectedHistoryType}
          onChangeRewardHistory={onChangeRewardHistory}
        />
      )}
      {selectedHistoryType === RewardHistoryType.vestingRewards && (
        <VestingRewards
          selectedHistoryType={selectedHistoryType}
          onChangeRewardHistory={onChangeRewardHistory}
        />
      )}
    </>
  );
};
