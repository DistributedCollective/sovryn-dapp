import React, { FC } from 'react';

import classNames from 'classnames';

import { SupportedTokens } from '@sovryn/contracts';

import { getTokenDisplayName } from '../../../constants/tokens';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import styles from './AssetPairRenderer.module.css';
import { AssetPairSize } from './AssetPairRenderer.types';

type AssetPairRendererProps = {
  className?: string;
  asset1: SupportedTokens;
  asset2: SupportedTokens;
  hideSymbol?: boolean;
  size?: AssetPairSize;
};

export const AssetPairRenderer: FC<AssetPairRendererProps> = ({
  className,
  asset1,
  asset2,
  hideSymbol,
  size = AssetPairSize.large,
}) => (
  <div className={classNames('flex items-center', className)}>
    <AssetRenderer
      asset={asset1}
      showAssetLogo
      className="mr-0"
      assetClassName="hidden"
      logoClassName={classNames(styles.assetLogo, styles[size])}
    />
    <AssetRenderer
      asset={asset2}
      showAssetLogo
      className="mr-0 -ml-2"
      assetClassName="hidden"
      logoClassName={classNames(styles.assetLogo, styles[size])}
    />
    {!hideSymbol && (
      <span className="flex items-center ml-2 text-gray-10">
        {getTokenDisplayName(asset1)}/{getTokenDisplayName(asset2)}
      </span>
    )}
  </div>
);
