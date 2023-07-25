import React, { FC, useCallback, useState } from 'react';

import { StakingistoryType } from './StakingHistoryFrame.type';
import { StakingDelegateChanges } from './components/StakingDelegateChanges';
import { StakingExtendedDuration } from './components/StakingExtendedDuration';
import { StakingHistory } from './components/StakingHistory/StakingHistory';
import { StakingWithdrawns } from './components/StakingWithdrawns';

export const StakingHistoryFrame: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    StakingistoryType.increase,
  );

  const onChangeHistoryType = useCallback((value: StakingistoryType) => {
    setSelectedHistoryType(value);
  }, []);
  return (
    <div>
      {selectedHistoryType === StakingistoryType.increase && (
        <StakingHistory
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingistoryType.unstake && (
        <StakingWithdrawns
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingistoryType.extend && (
        <StakingExtendedDuration
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingistoryType.delegate && (
        <StakingDelegateChanges
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
    </div>
  );
};
