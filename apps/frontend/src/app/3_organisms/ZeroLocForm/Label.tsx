import React, { FC, useCallback } from 'react';

import classNames from 'classnames';

import { formatValue } from '../../../utils/math';
import { AmountType } from './types';

type Tab = {
  value: AmountType;
  label: string;
  disabled?: boolean;
};

type CustomLabelProps = {
  maxAmount: number;
  symbol: string;
  tabs: Tab[];
  activeTab: AmountType;
  onTabChange: (value: AmountType) => void;
  onMaxAmountClicked: () => void;
  hasTrove?: boolean;
};

export const Label: FC<CustomLabelProps> = ({
  maxAmount,
  symbol,
  tabs,
  activeTab,
  onTabChange,
  onMaxAmountClicked,
  hasTrove = false,
}) => {
  const handleTabChange = useCallback(
    (value: AmountType) => () => onTabChange(value),
    [onTabChange],
  );

  return (
    <div className="w-full flex flex-row justify-between gap-4 items-center">
      {hasTrove ? (
        <div className="flex flex-row items-center justify-start gap-2">
          {tabs.map(tab => (
            <button
              key={tab.value}
              className={classNames(
                'font-roboto font-semibold text-[11px] px-3 py-1 rounded bg-gray-80 whitespace-nowrap',
                {
                  'text-gray-30 text-opacity-75':
                    !tab.disabled && tab.value !== activeTab,
                  'text-gray-40 cursor-not-allowed': tab.disabled,
                  'bg-gray-70 text-primary-20': tab.value === activeTab,
                },
              )}
              onClick={handleTabChange(tab.value)}
              disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : (
        <>{tabs[0].label}</>
      )}
      <button
        onClick={onMaxAmountClicked}
        className="text-gray-20 text-[11px] underline whitespace-nowrap"
      >
        (max {formatValue(maxAmount, 4)} {symbol.toUpperCase()})
      </button>
    </div>
  );
};
