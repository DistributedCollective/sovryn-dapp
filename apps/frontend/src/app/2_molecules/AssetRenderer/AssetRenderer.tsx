import React, { FC, useState } from 'react';
import { useEffect } from 'react';

import classNames from 'classnames';

import { getAssetData, getAssetDataByAddress } from '@sovryn/contracts';
import { applyDataAttr } from '@sovryn/ui';

import styles from './AssetRenderer.module.css';
import { ChainId, ChainIds } from '@sovryn/ethers-provider';

type AssetRendererProps = {
  /**
   * The asset that will be rendered and it's required.
   */
  asset?: string;
  chainId?: ChainId;
  /**
   * The asset address.
   */
  address?: string;
  /**
   * Whether to show the asset logo or not.
   * */
  showAssetLogo?: boolean;
  /**
   * Applied classNames to the asset element.
   * @default false
   * */
  assetClassName?: string;
  /**
   * Applied classNames to the outer element.
   * */
  className?: string;
  /**
   * Applied classNames to the asset logo element.
   * */
  logoClassName?: string;
  /**
   * Applied data attribute to the outer element.
   * */
  dataAttribute?: string;
};

export const AssetRenderer: FC<AssetRendererProps> = ({
  asset,
  chainId = ChainIds.RSK_MAINNET,
  address,
  showAssetLogo,
  assetClassName,
  className,
  dataAttribute,
  logoClassName,
}) => {
  const [token, setToken] = useState(asset);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [name, setName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (asset && !address) {
      getAssetData(asset, chainId)
        .then(item => {
          setLogo(item.icon);
          setToken(item.symbol);
          setName(item.name);
        })
        .catch(() => setLogo(''));
    }
  }, [address, asset, chainId, showAssetLogo]);

  useEffect(() => {
    if (address && !asset) {
      getAssetDataByAddress(address, chainId)
        .then(item => {
          setLogo(item.icon);
          setToken(item.symbol);
          setName(item.name);
        })
        .catch(() => setLogo(''));
    }
  }, [address, asset, chainId, showAssetLogo]);

  return (
    <div
      className={classNames(styles.container, className)}
      {...applyDataAttr(dataAttribute)}
    >
      {showAssetLogo && logo && (
        <div
          className={classNames(styles.assetLogo, logoClassName)}
          dangerouslySetInnerHTML={{ __html: logo }}
        />
      )}
      {token && (
        <span className={classNames(styles.asset, assetClassName)}>
          {name ?? token}
        </span>
      )}
    </div>
  );
};
