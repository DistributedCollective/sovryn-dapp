import React, { FC } from 'react';

import { BOB_CHAIN_ID } from '../../../config/chains';

import {
  AmountRenderer,
  AmountRendererProps,
} from '../AmountRenderer/AmountRenderer';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';

type AaveRowTitleProps = AmountRendererProps & {
  asset: string;
  label?: string;
};

export const AaveRowTitle: FC<AaveRowTitleProps> = ({
  asset,
  label,
  ...props
}) => (
  <div className="flex justify-between items-center w-full pr-3">
    <AssetRenderer
      showAssetLogo
      asset={asset}
      className="mr-1"
      chainId={BOB_CHAIN_ID}
    />
    <div className="pl-1 flex items-center font-medium">
      <AmountRenderer {...props} />
      {label && (
        <span className="ml-1 text-gray-30 font-semibold text-sm">{label}</span>
      )}
    </div>
  </div>
);
