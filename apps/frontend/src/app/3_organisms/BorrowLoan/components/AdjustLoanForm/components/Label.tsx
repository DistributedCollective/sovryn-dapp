import React, { FC, useCallback, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { ITabItem, Tabs, TabType } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { MaxButton } from '../../../../../2_molecules/MaxButton/MaxButton';
import { normalizeSuffix } from '../../../../../5_pages/BorrowPage/components/OpenLoansTable/OpenLoans.utils';
import { AmountType } from '../AdjustLoanForm.types';

interface ITabItemExtended extends ITabItem {
  amountType: AmountType;
}

type CustomLabelProps = {
  maxAmount: Decimal;
  token: string;
  tabs: ITabItemExtended[];
  onTabChange: (value: AmountType) => void;
  onMaxAmountClicked: () => void;
  isDisabled?: boolean;
};

export const Label: FC<CustomLabelProps> = ({
  maxAmount,
  token,
  tabs,
  onTabChange,
  onMaxAmountClicked,
  isDisabled,
}) => {
  const [index, setIndex] = useState(0);

  const onChangeIndex = useCallback(
    (index: number) => {
      setIndex(index);
      onTabChange(tabs[index]?.amountType);
    },
    [onTabChange, tabs],
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
