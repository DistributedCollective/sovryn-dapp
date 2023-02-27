import React from 'react';
import { useMemo } from 'react';

import classNames from 'classnames';

import { Tooltip, TooltipTrigger } from '@sovryn/ui';

import { AssetRenderer } from '../AssetRenderer/AssetRenderer';
import styles from './AssetValue.module.css';
import { AssetDecimals, AssetValueMode, AssetValueProps } from './types';

export const AssetValue: React.FC<AssetValueProps> = ({
  value,
  asset,
  mode = AssetValueMode.predefined,
  useTooltip = false,
  minDecimals = 0,
  maxDecimals = 8,
  className,
  assetClassName,
  isApproximation = false,
  showPositiveSign = false,
  showNegativeSign = false,
  showAssetLogo = false,
  dataAttribute,
}) => {
  const [formattedValue, fullFormattedValue] = useMemo(() => {
    if (!value && value !== 0) {
      return [];
    }

    let min = minDecimals;
    let max = maxDecimals;
    if (mode === AssetValueMode.predefined) {
      min = (asset && AssetDecimals[asset]) || 2;
      max = min;
    }
    if (mode === AssetValueMode.auto) {
      // normalize if one is not provided or provided incorrectly
      min = Math.min(min, max);
      max = Math.max(min, max);
    }

    const numberValue =
      typeof value === 'string' ? Number(fromWei(amount, unitName)) : value;

    return [
      formatNumber(
        numberValue,
        {
          minimumFractionDigits: min,
          maximumFractionDigits: max,
        },
        isApproximation,
        showPositiveSign,
        showNegativeSign,
      ),
      formatNumber(
        numberValue,
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
    asset,
    isApproximation,
    showPositiveSign,
    showNegativeSign,
  ]);

  if (!formattedValue) {
    return null;
  }

  const assetValue = (
    <span>
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
  value: number,
  options: Intl.NumberFormatOptions,
  isApproximation: boolean,
  showPositiveSign: boolean,
  showNegativeSign: boolean,
) => {
  let numberString = value.toLocaleString(navigator.language, options);
  if (value > 0) {
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
