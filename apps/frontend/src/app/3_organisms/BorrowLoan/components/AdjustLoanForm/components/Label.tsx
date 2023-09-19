import React, { useCallback } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { ITabItem, Tabs, TabType } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import { normalizeSuffix } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoans.utils';
import { CollateralTabAction, DebtTabAction } from '../AdjustLoanForm.types';

interface ITabItemExtended<T> extends ITabItem {
  tabAction: T;
}

type CustomLabelProps<T> = {
  maxAmount: Decimal;
  token: string;
  tabs: ITabItemExtended<T>[];
  onTabChange: (value: T) => void;
  onMaxAmountClicked: () => void;
  isDisabled?: boolean;
  index: number;
  setIndex: (index: number) => void;
};

export const Label = <T extends DebtTabAction | CollateralTabAction>({
  maxAmount,
  token,
  tabs,
  onTabChange,
  onMaxAmountClicked,
  isDisabled,
  index,
  setIndex,
}: CustomLabelProps<T>) => {
  const onChangeIndex = useCallback(
    (index: number) => {
      setIndex(index);
      onTabChange(tabs[index]?.tabAction);
    },
    [onTabChange, setIndex, tabs],
  );

  return (
    <div className="w-full flex flex-row justify-between gap-4 items-center">
      <Tabs
        items={tabs}
        index={index}
        onChange={onChangeIndex}
        type={TabType.secondary}
      />

      {!isDisabled && (
        <MaxButton
          onClick={onMaxAmountClicked}
          value={maxAmount}
          token={normalizeSuffix(token) as SupportedTokens}
          dataAttribute={`adjust-loan-${token}-max`}
        />
      )}
    </div>
  );
};
