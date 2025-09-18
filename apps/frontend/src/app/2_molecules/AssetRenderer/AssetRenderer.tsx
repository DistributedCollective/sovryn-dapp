import React, { FC, PropsWithChildren, useState } from 'react';
import { useEffect } from 'react';

import classNames from 'classnames';

import { getAssetData, getAssetDataByAddress } from '@sovryn/contracts';
import { ChainId, ChainIds } from '@sovryn/ethers-provider';
import { applyDataAttr } from '@sovryn/ui';

import styles from './AssetRenderer.module.css';

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
   * @default false
   * */
  showAssetLogo?: boolean;
  /**
   * Applied classNames to the asset element.
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
  /**
   * Whether to show the asset long name.
   * */
  showLongName?: boolean;
  /**
   * Applied classNames to the asset long name element.
   * */
  assetLongNameClassName?: string;
};

export const AssetRenderer: FC<PropsWithChildren<AssetRendererProps>> = ({
  asset,
  chainId = ChainIds.RSK_MAINNET,
  address,
  showAssetLogo,
  showLongName,
  assetLongNameClassName,
  assetClassName,
  className,
  dataAttribute,
  logoClassName,
  children,
}) => {
  const [token, setToken] = useState(asset);
  const [longName, setLongName] = useState<string | undefined>();
  const [logo, setLogo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (asset && !address) {
      getAssetData(asset, chainId)
        .then(item => {
          setLogo(item.icon);
          setToken(item.symbol);
          setLongName(item.name);
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
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          {token && (
            <span className={classNames(styles.asset, assetClassName)}>
              {token}
            </span>
          )}
          {showLongName && longName && (
            <span
              className={classNames(styles.longName, assetLongNameClassName)}
            >
              {longName}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
