import React, { FC, useCallback, useState, useMemo } from 'react';

import { Select } from '@sovryn/ui';

import { BorrowHistoryType } from './BorrowHistory.types';
import { borrowHistoryOptions } from './BorrowHistory.utils';
import { CloseWithDepositLoanFrame } from './components/CloseWithDepositLoanFrame/CloseWithDepositLoanFrame';
import { CloseWithSwapLoanFrame } from './components/CloseWithSwapLoanFrame/CloseWithSwapLoanFrame';
import { CollateralSurplusHistoryFrame } from './components/CollateralSurplusFrame/CollateralSurplusHistoryFrame';
import { DepositCollateralLoanFrame } from './components/DepositCollateralLoanFrame/DepositCollateralLoanFrame';
import { LiquidationLoanFrame } from './components/LiquidationLoanFrame/LiquidationLoanFrame';
import { NewLoanHistoryFrame } from './components/NewLoanFrame/NewLoanHistoryFrame';
import { RolloverLoanHistoryFrame } from './components/RolloverLoanFrame/RolloverLoanHistoryFrame';
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
      case BorrowHistoryType.newLoan:
        return <NewLoanHistoryFrame>{selectComponent}</NewLoanHistoryFrame>;
      case BorrowHistoryType.depositCollateralLoan:
        return (
          <DepositCollateralLoanFrame>
            {selectComponent}
          </DepositCollateralLoanFrame>
        );
      case BorrowHistoryType.closeWithSwapLoan:
        return (
          <CloseWithSwapLoanFrame>{selectComponent}</CloseWithSwapLoanFrame>
        );
      case BorrowHistoryType.closeWithDepositLoan:
        return (
          <CloseWithDepositLoanFrame>
            {selectComponent}
          </CloseWithDepositLoanFrame>
        );
      case BorrowHistoryType.liquidationLoan:
        return <LiquidationLoanFrame>{selectComponent}</LiquidationLoanFrame>;
      case BorrowHistoryType.rolloversLoan:
        return (
          <RolloverLoanHistoryFrame>{selectComponent}</RolloverLoanHistoryFrame>
        );
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
