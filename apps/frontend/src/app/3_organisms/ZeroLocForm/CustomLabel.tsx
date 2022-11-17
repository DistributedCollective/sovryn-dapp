import React, { FC } from 'react';

import classNames from 'classnames';

type CustomLabelProps = {
  title: string;
  maxAmount: number;
  symbol: string;
  disableIncrease?: boolean;
  disableDecrease?: boolean;
  onIncreaseClicked: () => void;
  onDecreaseClicked: () => void;
  onMaxAmountClicked: () => void;
};

export const CustomLabel: FC<CustomLabelProps> = ({
  title,
  maxAmount,
  symbol,
  disableDecrease,
  disableIncrease,
  onMaxAmountClicked,
  onDecreaseClicked,
  onIncreaseClicked,
}) => {
  return (
    <div className="w-full flex flex-row justify-between gap-4 items-center">
      <div className="flex flex-row items-center justify-start gap-2">
        <span className="text-sm">{title}</span>
        <button
          className={classNames(
            'font-roboto font-semibold text-xs p-1 rounded bg-gray-50 text-gray-20',
            {
              'bg-gray-70 text-gray-40 cursor-not-allowed': disableIncrease,
            },
          )}
          onClick={onIncreaseClicked}
          disabled={disableIncrease}
        >
          +
        </button>
        <button
          className={classNames(
            'font-roboto font-semibold text-xs p-1 rounded bg-gray-50 text-gray-20',
            {
              'bg-gray-70 text-gray-40 cursor-not-allowed': disableDecrease,
            },
          )}
          onClick={onDecreaseClicked}
          disabled={disableDecrease}
        >
          -
        </button>
      </div>
      <button
        onClick={onMaxAmountClicked}
        className="text-gray-20 text-xs underline"
      >
        (max {maxAmount.toFixed(4)} {symbol})
      </button>
    </div>
  );
};
