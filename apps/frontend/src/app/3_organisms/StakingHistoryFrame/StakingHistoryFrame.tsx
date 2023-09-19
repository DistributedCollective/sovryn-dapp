import React, { FC, useCallback, useState } from 'react';

import { StakingHistoryType } from './StakingHistoryFrame.type';
import { StakingDelegateChanges } from './components/StakingDelegateChanges/StakingDelegateChanges';
import { StakingExtendedDuration } from './components/StakingExtendedDuration/StakingExtendedDuration';
import { StakingHistory } from './components/StakingHistory/StakingHistory';
import { StakingWithdraws } from './components/StakingWithdraws/StakingWithdraws';
import { VestingDelegateChanges } from './components/VestingDelegateChanges/VestingDelegateChanges';

export const StakingHistoryFrame: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    StakingHistoryType.increase,
  );

  const onChangeHistoryType = useCallback((value: StakingHistoryType) => {
    setSelectedHistoryType(value);
  }, []);
  return (
    <div>
      {selectedHistoryType === StakingHistoryType.increase && (
        <StakingHistory
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingHistoryType.unstake && (
        <StakingWithdraws
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingHistoryType.extend && (
        <StakingExtendedDuration
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingHistoryType.delegate && (
        <StakingDelegateChanges
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
      {selectedHistoryType === StakingHistoryType.delegateVesting && (
        <VestingDelegateChanges
          selectedHistoryType={selectedHistoryType}
          onChangeHistoryType={onChangeHistoryType}
        />
      )}
    </div>
  );
};
