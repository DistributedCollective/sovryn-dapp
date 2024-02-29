import React, { FC, useState } from 'react';
import { useEffect } from 'react';

import classNames from 'classnames';

import {
  getTokenDetails,
  getTokenDetailsByAddress,
  SupportedTokens,
} from '@sovryn/contracts';
import { applyDataAttr } from '@sovryn/ui';

import {
  getTokenDisplayName,
  getTokenLongName,
} from '../../../constants/tokens';
import styles from './AssetRenderer.module.css';

type AssetRendererProps = {
  /**
   * The asset that will be rendered and it's required.
   */
  asset?: SupportedTokens;
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

export const AssetRenderer: FC<AssetRendererProps> = ({
  asset,
  address,
  showAssetLogo,
  assetClassName,
  className,
  dataAttribute,
  logoClassName,
  showLongName,
  assetLongNameClassName,
}) => {
  const [token, setToken] = useState(asset);
  const [logo, setLogo] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getAssetDetails = async () => {
      if (asset) {
        await getTokenDetails(asset)
          .then(item => {
            setLogo(item.icon);
            setToken(item.symbol);
          })
          .catch(() => setLogo(''));
      }
    };

    !address && !!asset && getAssetDetails();
  }, [address, asset, showAssetLogo]);

  useEffect(() => {
    const getAssetDetails = async () => {
      if (address) {
        await getTokenDetailsByAddress(address)
          .then(item => {
            setLogo(item.icon);
            setToken(item.symbol);
          })
          .catch(() => setLogo(''));
      }
    };

    !asset && !!address && getAssetDetails();
  }, [address, asset, showAssetLogo]);

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
          {getTokenDisplayName(token)}
        </span>
      )}

      {token && showLongName && (
        <span className={assetLongNameClassName}>
          {getTokenLongName(token)}
        </span>
      )}
    </div>
  );
};
