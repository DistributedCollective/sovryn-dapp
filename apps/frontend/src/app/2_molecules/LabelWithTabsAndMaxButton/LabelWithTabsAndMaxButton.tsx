import React, { useCallback } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { ITabItem, Tabs, TabType } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { normalizeSuffix } from '../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoans.utils';
import { MaxButton } from '../MaxButton/MaxButton';

interface ITabItemExtended<T> extends ITabItem {
  tabAction: T;
}

type LabelWithTabsAndMaxButtonProps<T> = {
  maxAmount: Decimal;
  token: string;
  tabs: ITabItemExtended<T>[];
  onTabChange: (value: T) => void;
  onMaxAmountClicked: () => void;
  isDisabled?: boolean;
  index: number;
  setIndex: (index: number) => void;
  dataAttributePrefix?: string;
};

export function LabelWithTabsAndMaxButton<T>({
  maxAmount,
  token,
  tabs,
  onTabChange,
  onMaxAmountClicked,
  isDisabled,
  index,
  setIndex,
  dataAttributePrefix,
}: LabelWithTabsAndMaxButtonProps<T>) {
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
          dataAttribute={`${dataAttributePrefix}-${token}-max`}
        />
      )}
    </div>
  );
}
