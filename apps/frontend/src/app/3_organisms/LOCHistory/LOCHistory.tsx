import React, { FC, useCallback, useState } from 'react';

import { CollateralSurplusHistoryFrame } from './components/CollateralSurplusFrame/CollateralSurplusHistoryFrame';
import { TransactionHistoryFrame } from './components/TransactionHistoryFrame';
import { LOCHistoryType } from './types';

export const LOCHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] = useState(
    LOCHistoryType.lineOfCredit,
  );

  const onChangeRewardHistory = useCallback((value: LOCHistoryType) => {
    setSelectedHistoryType(value);
  }, []);

  return (
    <>
      {selectedHistoryType === LOCHistoryType.lineOfCredit && (
        <TransactionHistoryFrame
          selectedHistoryType={selectedHistoryType}
          onChangeLOCHistory={onChangeRewardHistory}
        />
      )}
      {selectedHistoryType === LOCHistoryType.collateralSurplus && (
        <CollateralSurplusHistoryFrame
          selectedHistoryType={selectedHistoryType}
          onChangeLOCHistory={onChangeRewardHistory}
        />
      )}
    </>
  );
};
