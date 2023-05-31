import React, { FC, useCallback, useState } from 'react';

import { StabilityPoolRewards } from './components/StabilityPoolRewards/StabilityPoolRewards';
import { StabilityPoolSubsidies } from './components/StabilityPoolSubsidies/StabilityPoolSubsidies';
import { RewardHistoryType } from './types';

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
    </>
  );
};
