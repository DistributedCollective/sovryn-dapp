import React, { FC, useCallback, useState, useMemo } from 'react';

import { Select } from '@sovryn/ui';

import { useCurrentChain } from '../../../hooks/useChainStore';
import { isBobChain } from '../../../utils/chain';
import { BORROW_HISTORY_OPTIONS } from './BorrowHistory.constants';
import { BorrowHistoryType } from './BorrowHistory.types';
import { AaveCloseWithDepositLoanFrame } from './components/AaveCloseWithDepositLoanFrame/AaveCloseWithDepositLoanFrame';
import { AaveNewLoanHistoryFrame } from './components/AaveNewLoanFrame/AaveNewLoanHistoryFrame';
import { CloseWithDepositLoanFrame } from './components/CloseWithDepositLoanFrame/CloseWithDepositLoanFrame';
import { CloseWithSwapLoanFrame } from './components/CloseWithSwapLoanFrame/CloseWithSwapLoanFrame';
import { CollateralSurplusHistoryFrame } from './components/CollateralSurplusFrame/CollateralSurplusHistoryFrame';
import { DepositCollateralLoanFrame } from './components/DepositCollateralLoanFrame/DepositCollateralLoanFrame';
import { LiquidationLoanFrame } from './components/LiquidationLoanFrame/LiquidationLoanFrame';
import { NewLoanHistoryFrame } from './components/NewLoanFrame/NewLoanHistoryFrame';
import { RolloverLoanHistoryFrame } from './components/RolloverLoanFrame/RolloverLoanHistoryFrame';
import { TransactionHistoryFrame } from './components/TransactionHistoryFrame';

export const BorrowHistory: FC = () => {
  const chainId = useCurrentChain();
  const [selectedHistoryType, setSelectedHistoryType] =
    useState<BorrowHistoryType>(BORROW_HISTORY_OPTIONS(chainId)[0].value);

  const onChangeRewardHistory = useCallback((value: BorrowHistoryType) => {
    setSelectedHistoryType(value);
  }, []);

  const selectComponent = useMemo(
    () => (
      <Select
        dataAttribute={`borrow-history-${selectedHistoryType}`}
        value={selectedHistoryType}
        onChange={onChangeRewardHistory}
        options={BORROW_HISTORY_OPTIONS(chainId)}
        className="min-w-36 w-full lg:w-auto"
      />
    ),
    [selectedHistoryType, onChangeRewardHistory, chainId],
  );

  const renderHistoryFrame = useMemo(() => {
    if (isBobChain(chainId)) {
      switch (selectedHistoryType) {
        case BorrowHistoryType.newLoan:
          return (
            <AaveNewLoanHistoryFrame>{selectComponent}</AaveNewLoanHistoryFrame>
          );
        case BorrowHistoryType.closeWithDepositLoan:
          return (
            <AaveCloseWithDepositLoanFrame>
              {selectComponent}
            </AaveCloseWithDepositLoanFrame>
          );
        default:
          return null;
      }
    }

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
  }, [selectedHistoryType, selectComponent, chainId]);

  return <>{renderHistoryFrame}</>;
};
