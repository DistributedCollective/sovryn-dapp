import React, { FC, useCallback, useState, useMemo } from 'react';

import { Select } from '@sovryn/ui';

import { BorrowHistoryType } from './BorrowHistory.types';
import { borrowHistoryOptions } from './BorrowHistory.utils';
import { CollateralSurplusHistoryFrame } from './components/CollateralSurplusFrame/CollateralSurplusHistoryFrame';
import { LoanHistoryFrame } from './components/LoanFrame/LoanHistoryFrame';
import { TransactionHistoryFrame } from './components/TransactionHistoryFrame';

export const BorrowHistory: FC = () => {
  const [selectedHistoryType, setSelectedHistoryType] =
    useState<BorrowHistoryType>(BorrowHistoryType.lineOfCredit);

  const onChangeRewardHistory = useCallback((value: BorrowHistoryType) => {
    setSelectedHistoryType(value);
  }, []);

  const selectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`borrow-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={onChangeRewardHistory}
        options={borrowHistoryOptions}
        className="min-w-36"
      />
    ),
    [selectedHistoryType, onChangeRewardHistory],
  );

  const renderHistoryFrame = useMemo(() => {
    switch (selectedHistoryType) {
      case BorrowHistoryType.lineOfCredit:
        return (
          <TransactionHistoryFrame>{selectComponent}</TransactionHistoryFrame>
        );
      case BorrowHistoryType.fixedInterestLoan:
        return <LoanHistoryFrame>{selectComponent}</LoanHistoryFrame>;
      case BorrowHistoryType.collateralSurplus:
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
