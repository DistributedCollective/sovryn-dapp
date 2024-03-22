import React from 'react';
import { useMemo } from 'react';

import classNames from 'classnames';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { findAsset } from '../../../utils/asset';
import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import styles from './AssetValue.module.css';
import { AssetValueMode, AssetValueProps } from './types';

export const AssetValue: React.FC<AssetValueProps> = ({
  value,
  asset,
  mode = AssetValueMode.predefined,
  useTooltip = false,
  minDecimals = 0,
  maxDecimals = 8,
  className,
  containerClassName,
  assetClassName,
  isApproximation = false,
  showPositiveSign = false,
  showNegativeSign = false,
  showAssetLogo = false,
  dataAttribute,
  chainId = RSK_CHAIN_ID,
}) => {
  const [formattedValue, fullFormattedValue] = useMemo(() => {
    if (!value && value !== 0) {
      return [];
    }

    let min = minDecimals;
    let max = maxDecimals;
    if (mode === AssetValueMode.predefined) {
      if (asset) {
        const token = findAsset(asset, chainId);
        min = token?.decimals || 2;
      } else {
        min = 2;
      }
      max = min;
    }
    if (mode === AssetValueMode.auto) {
      // normalize if one is not provided or provided incorrectly
      min = Math.min(min, max);
      max = Math.max(min, max);
    }

    return [
      formatNumber(
        value,
        {
          minimumFractionDigits: min,
          maximumFractionDigits: max,
        },
        isApproximation,
        showPositiveSign,
        showNegativeSign,
      ),
      formatNumber(
        value,
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 18,
        },
        isApproximation,
        showPositiveSign,
        showNegativeSign,
      ),
    ];
  }, [
    value,
    minDecimals,
    maxDecimals,
    mode,
    isApproximation,
    showPositiveSign,
    showNegativeSign,
    asset,
    chainId,
  ]);

  if (!formattedValue) {
    return null;
  }

  const assetValue = (
    <span className={containerClassName}>
      {formattedValue}
      {asset && (
        <AssetRenderer
          asset={asset}
          assetClassName={assetClassName}
          dataAttribute={dataAttribute}
          showAssetLogo={showAssetLogo}
          className={styles.asset}
        />
      )}
    </span>
  );

  if (useTooltip) {
    return (
      <Tooltip
        trigger={TooltipTrigger.click}
        className={classNames(styles.tooltip, className)}
        tooltipClassName={styles.tooltipContent}
        content={
          <>
            {fullFormattedValue}
            {asset && (
              <AssetRenderer
                asset={asset}
                assetClassName={assetClassName}
                dataAttribute={dataAttribute}
                className={styles.asset}
              />
            )}
          </>
        }
      >
        {assetValue}
      </Tooltip>
    );
  }

  return assetValue;
};

const formatNumber = (
  value: Decimal,
  options: Intl.NumberFormatOptions,
  isApproximation: boolean,
  showPositiveSign: boolean,
  showNegativeSign: boolean,
) => {
  let numberString = value
    .toNumber()
    .toLocaleString(navigator.language, options);
  if (value.gt(0)) {
    if (showPositiveSign) {
      numberString = `+${numberString}`;
    } else if (showNegativeSign) {
      numberString = `-${numberString}`;
    }
  }

  if (isApproximation) {
    numberString = `≈ ${numberString}`;
  }

  return numberString;
};
