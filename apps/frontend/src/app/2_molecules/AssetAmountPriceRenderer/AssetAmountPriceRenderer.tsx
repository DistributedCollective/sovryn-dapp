import React, { FC } from 'react';

import classNames from 'classnames';

import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type AssetAmountPriceRendererProps = {
  asset: string;
  value: Decimalish;
  valueUsd: Decimalish;
  className?: string;
  valueClassName?: string;
  priceClassName?: string;
};

export const AssetAmountPriceRenderer: FC<AssetAmountPriceRendererProps> = ({
  asset,
  value,
  valueUsd,
  className,
  valueClassName,
  priceClassName,
}) => {
  return (
    <div className={classNames('flex flex-col gap-1', className)}>
      <AmountRenderer
        value={value}
        suffix={asset}
        className={valueClassName}
        precision={2}
      />
      <AmountRenderer
        value={valueUsd}
        prefix="$"
        precision={2}
        className={classNames(
          'text-gray-40 text-xs font-medium',
          priceClassName,
        )}
      />
    </div>
  );
};
