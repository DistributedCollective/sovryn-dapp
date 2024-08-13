import React, { FC } from 'react';

import classNames from 'classnames';

import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type AssetAmountPriceRendererProps = {
  value: Decimalish;
  asset: string;
  className?: string;
  valueClassName?: string;
  priceClassName?: string;
};

export const AssetAmountPriceRenderer: FC<AssetAmountPriceRendererProps> = ({
  value,
  asset,
  className,
  valueClassName,
  priceClassName,
}) => {
  // TODO: get price in usd
  const usdPrice = value;

  return (
    <div className={className ?? 'flex flex-col text-right space-y-1'}>
      <AmountRenderer value={value} suffix={asset} className={valueClassName} />
      <AmountRenderer
        value={usdPrice}
        prefix={'$'}
        className={classNames(
          'text-gray-40 text-xs font-medium',
          priceClassName,
        )}
      />
    </div>
  );
};
