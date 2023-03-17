import React, { FC, useCallback, useState } from 'react';

import { ITabItem, Tabs, TabType } from '@sovryn/ui';

import { MaxButton } from '../../2_molecules/MaxButton/MaxButton';
import { AmountType } from './types';
import { bn } from '../../../utils/math';

interface ITabItemExtended extends ITabItem {
  amountType: AmountType;
}

type CustomLabelProps = {
  maxAmount: string;
  symbol: string;
  tabs: ITabItemExtended[];
  onTabChange: (value: AmountType) => void;
  onMaxAmountClicked: () => void;
  hasTrove?: boolean;
};

export const Label: FC<CustomLabelProps> = ({
  maxAmount,
  symbol,
  tabs,
  onTabChange,
  onMaxAmountClicked,
  hasTrove = false,
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
      {hasTrove ? (
        <Tabs
          items={tabs}
          index={index}
          onChange={onChangeIndex}
          type={TabType.secondary}
        />
      ) : (
        <>{tabs[0].label}</>
      )}

      <MaxButton
        onClick={onMaxAmountClicked}
        value={bn(maxAmount)}
        token={symbol}
        dataAttribute="convert-from-max"
      />
    </div>
  );
};
