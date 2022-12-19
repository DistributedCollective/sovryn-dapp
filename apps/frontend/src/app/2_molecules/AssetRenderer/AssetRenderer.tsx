import React, { FC, useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';

import classNames from 'classnames';

import { SupportedTokenList, SupportedTokens } from '@sovryn/contracts';
import { applyDataAttr } from '@sovryn/ui';

import styles from './AssetRenderer.module.css';

type AssetRendererProps = {
  /**
   * The asset that will be rendered and it's required.
   */
  asset: SupportedTokens;
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
   * Applied data-layout-id to the outer element.
   * */
  dataAttribute?: string;
};

export const AssetRenderer: FC<AssetRendererProps> = ({
  asset,
  showAssetLogo,
  assetClassName,
  className,
  dataAttribute,
}) => {
  const [logo, setLogo] = useState('');
  const getAssetLogo = useCallback((asset: SupportedTokens) => {
    const assetData = SupportedTokenList.find(item => item.symbol === asset);
    if (!assetData) {
      throw new Error(`Asset ${asset} not found in the list.`);
    }
    return assetData.getIcon();
  }, []);

  useEffect(() => {
    const getLogo = async () => {
      const logo = await getAssetLogo(asset);
      setLogo(logo);
    };
    getLogo();
  }, [asset, getAssetLogo]);

  return (
    <div
      className={classNames(styles.container, className)}
      {...applyDataAttr(dataAttribute)}
    >
      {showAssetLogo && (
        <div
          className={styles.assetLogo}
          dangerouslySetInnerHTML={{ __html: logo }}
        />
      )}
      <span className={classNames(styles.asset, assetClassName)}>{asset}</span>
    </div>
  );
};
