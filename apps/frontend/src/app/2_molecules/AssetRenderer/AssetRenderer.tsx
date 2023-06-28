import React, { FC, useState } from 'react';
import { useEffect } from 'react';

import classNames from 'classnames';

import { getTokenDetails, SupportedTokens } from '@sovryn/contracts';
import { applyDataAttr } from '@sovryn/ui';

import { getTokenDisplayName } from '../../../constants/tokens';
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
   * Applied data attribute to the outer element.
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
  const [logo, setLogo] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getLogo = async () =>
      await getTokenDetails(asset)
        .then(item => setLogo(item.icon))
        .catch(() => setLogo(''));

    showAssetLogo && getLogo();
  }, [asset, showAssetLogo]);

  return (
    <div
      className={classNames(styles.container, className)}
      {...applyDataAttr(dataAttribute)}
    >
      {showAssetLogo && logo && (
        <div
          className={styles.assetLogo}
          dangerouslySetInnerHTML={{ __html: logo }}
        />
      )}
      <span className={classNames(styles.asset, assetClassName)}>
        {getTokenDisplayName(asset)}
      </span>
    </div>
  );
};
