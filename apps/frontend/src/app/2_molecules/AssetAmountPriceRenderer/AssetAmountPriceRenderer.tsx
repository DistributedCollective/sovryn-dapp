import React, { FC } from 'react';

import classNames from 'classnames';

import { Decimalish } from '@sovryn/utils';

import { AmountRenderer } from '../AmountRenderer/AmountRenderer';

type AssetAmountPriceRendererProps = {
  value: Decimalish;
  asset: string;
  className?: string;
};

export const AssetAmountPriceRenderer: FC<AssetAmountPriceRendererProps> = ({
  value,
  asset,
  className,
}) => {
  // TODO: get price in usd
  const usdPrice = value;

  return (
    <div className={classNames('flex flex-col text-right', className)}>
      <AmountRenderer value={value} suffix={asset} />
      <AmountRenderer
        value={usdPrice}
        prefix={'$'}
        className="text-gray-40 text-xs font-medium"
      />
    </div>
  );
};
