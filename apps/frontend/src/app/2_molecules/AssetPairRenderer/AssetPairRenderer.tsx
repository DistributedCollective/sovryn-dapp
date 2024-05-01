import React, { FC } from 'react';

import classNames from 'classnames';

import { ChainId, ChainIds } from '@sovryn/ethers-provider';

import { findAsset } from '../../../utils/asset';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import styles from './AssetPairRenderer.module.css';
import { AssetPairSize } from './AssetPairRenderer.types';

type AssetPairRendererProps = {
  className?: string;
  asset1: string;
  asset2: string;
  hideSymbol?: boolean;
  size?: AssetPairSize;
  chainId?: ChainId;
};

export const AssetPairRenderer: FC<AssetPairRendererProps> = ({
  className,
  asset1,
  asset2,
  hideSymbol,
  size = AssetPairSize.large,
  chainId = ChainIds.RSK_MAINNET,
}) => (
  <div className={classNames('flex items-center', className)}>
    <AssetRenderer
      asset={asset1}
      chainId={chainId}
      showAssetLogo
      className="mr-0"
      assetClassName="hidden"
      logoClassName={classNames(styles.assetLogo, styles[size])}
    />
    <AssetRenderer
      asset={asset2}
      chainId={chainId}
      showAssetLogo
      className="mr-0 -ml-2"
      assetClassName="hidden"
      logoClassName={classNames(styles.assetLogo, styles[size])}
    />
    {!hideSymbol && (
      <span className="flex items-center ml-2 text-gray-10">
        {findAsset(asset1, chainId)?.symbol}/
        {findAsset(asset2, chainId)?.symbol}
      </span>
    )}
  </div>
);
