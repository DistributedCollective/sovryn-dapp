import React, { FC, useCallback, useState, useMemo } from 'react';

import { Select } from '@sovryn/ui';

import { LOCHistoryType } from './LOCHistory.types';
import { locHistoryOptions } from './LOCHistory.utils';
import { CollateralSurplusHistoryFrame } from './components/CollateralSurplusFrame/CollateralSurplusHistoryFrame';
import { TransactionHistoryFrame } from './components/TransactionHistoryFrame';

export const LOCHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] =
    useState<LOCHistoryType>(LOCHistoryType.lineOfCredit);

  const onChangeRewardHistory = useCallback((value: LOCHistoryType) => {
    setSelectedHistoryType(value);
  }, []);

  const selectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`loc-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={onChangeRewardHistory}
        options={locHistoryOptions}
        className="min-w-36"
      />
    ),
    [selectedHistoryType, onChangeRewardHistory],
  );

  const renderHistoryFrame = useMemo(() => {
    switch (selectedHistoryType) {
      case LOCHistoryType.lineOfCredit:
        return (
          <TransactionHistoryFrame>{selectComponent}</TransactionHistoryFrame>
        );
      case LOCHistoryType.collateralSurplus:
        return (
          <CollateralSurplusHistoryFrame>
            {selectComponent}
          </CollateralSurplusHistoryFrame>
        );
      default:
        return null;
    }
  }, [selectedHistoryType, selectComponent]);

  return <>{renderHistoryFrame}</>;
};
