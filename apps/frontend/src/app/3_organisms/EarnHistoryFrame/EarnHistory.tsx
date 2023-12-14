import React, { FC, useMemo, useState } from 'react';

import { Select } from '@sovryn/ui';

import { EARN_HISTORY_OPTIONS } from './EarnHistory.constants';
import { EarnHistoryType } from './EarnHistory.types';
import { LendingHistoryFrame } from './components/LendingHistoryFrame/LendingHistoryFrame';
import { MarketMakingHistoryFrame } from './components/MarketMakingHistoryFrame/MarketMakingHistoryFrame';
import { StabilityPoolHistoryFrame } from './components/StabilityPoolHistoryFrame/StabilityPoolHistoryFrame';

export const EarnHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    EarnHistoryType.stabilityPool,
  );

  const SelectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`earn-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={setSelectedHistoryType}
        options={EARN_HISTORY_OPTIONS}
        className="min-w-36 w-full lg:w-auto"
      />
    ),
    [selectedHistoryType],
  );

  const HistoryFrame = useMemo(() => {
    switch (selectedHistoryType) {
      case EarnHistoryType.stabilityPool:
        return (
          <>
            <StabilityPoolHistoryFrame>
              {SelectComponent}
            </StabilityPoolHistoryFrame>
          </>
        );
      case EarnHistoryType.lending:
        return (
          <>
            <LendingHistoryFrame>{SelectComponent}</LendingHistoryFrame>
          </>
        );

      case EarnHistoryType.marketMaking:
        return (
          <>
            <MarketMakingHistoryFrame>
              {SelectComponent}
            </MarketMakingHistoryFrame>
          </>
        );
    }
  }, [SelectComponent, selectedHistoryType]);

  return <>{HistoryFrame}</>;
};
