import React, { FC, useCallback, useState } from 'react';

import { StakingHistory } from './StakingHistory/StakingHistory';
import { StakingistoryType } from './StakingHistoryFrame.type';
import { StakingWithdrawns } from './StakingWithdrawns';

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
    </div>
  );
};
