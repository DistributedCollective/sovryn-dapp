import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  SimpleTable,
  SimpleTableRow,
  Slider,
} from '@sovryn/ui';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../../../locales/i18n';
import { decimalic } from '../../../../../../../../../utils/math';
import { AmbientLiquidityPool } from '../../../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useGetTokenDecimals } from '../../../../../BobWIthdrawModal/hooks/useGetTokenDecimals';
import {
  MAXIMUM_PRICE,
  MINIMUM_PRICE,
} from '../../../../BobDepositModal.constants';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { BUTTON_OPTIONS, INFINITE } from './BalancedRange.constants';
import { renderRangeWidthClassName } from './BalancedRange.utils';

type BalancedRangeProps = {
  pool: AmbientLiquidityPool;
};

export const BalancedRange: FC<BalancedRangeProps> = ({ pool }) => {
  const {
    rangeWidth,
    setRangeWidth,
    setMinimumPrice,
    setMaximumPrice,
    minimumPrice,
    maximumPrice,
  } = useDepositContext();

  const isInfiniteRange = useMemo(() => rangeWidth === 100, [rangeWidth]);

  const { spotPrice: currentPrice, poolTokens } = useGetPoolInfo(
    pool.base,
    pool.quote,
  );

  const { quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  const updatePrice = useCallback(
    (isMinimumPrice: boolean, value: number) => {
      if (value === 0) {
        return currentPrice;
      }

      if (value === 100) {
        return isMinimumPrice ? MINIMUM_PRICE : MAXIMUM_PRICE;
      }

      const priceDifference = Decimal.from(currentPrice).mul(
        Decimal.from(value).div(100),
      );

      if (isMinimumPrice) {
        const result = decimalic(currentPrice).sub(priceDifference);

        return result.lt(0) ? 0 : result.toNumber();
      }

      return decimalic(currentPrice).add(priceDifference).toNumber();
    },
    [currentPrice],
  );

  useEffect(() => {
    if (minimumPrice === 0 && currentPrice !== 0) {
      setMinimumPrice(updatePrice(true, rangeWidth));
    }

    if (maximumPrice === 0 && currentPrice !== 0) {
      setMaximumPrice(updatePrice(false, rangeWidth));
    }
  }, [
    currentPrice,
    maximumPrice,
    minimumPrice,
    rangeWidth,
    setMaximumPrice,
    setMinimumPrice,
    updatePrice,
  ]);

  const onRangeChange = useCallback(
    (value: number) => {
      setMinimumPrice(updatePrice(true, value));
      setMaximumPrice(updatePrice(false, value));
      setRangeWidth(value);
    },
    [setMaximumPrice, setMinimumPrice, setRangeWidth, updatePrice],
  );

  return (
    <>
      <div className="flex items-center flex-col">
        <div className="text-xs font-medium text-gray-30">
          {t(translations.bobMarketMakingPage.depositModal.rangeWidth)}
        </div>
        <div className="bg-gray-80 rounded text-gray-10 text-sm font-medium px-12 py-2 mt-2">
          {!isInfiniteRange ? `~ ${rangeWidth}%` : INFINITE}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {BUTTON_OPTIONS.map(item => (
          <Button
            text={item === 100 ? INFINITE : `${item}%`}
            key={item}
            onClick={() => onRangeChange(item)}
            style={ButtonStyle.secondary}
            className={renderRangeWidthClassName(rangeWidth, item)}
          />
        ))}
      </div>

      <div className="px-4 mt-4">
        <Slider onChange={onRangeChange} value={rangeWidth} min={1} max={100} />
      </div>

      <SimpleTable className="mt-12">
        <SimpleTableRow
          label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
          value={
            isInfiniteRange ? (
              <span className="text-xs font-medium">0</span>
            ) : (
              <AmountRenderer
                value={minimumPrice}
                suffix={pool.base}
                decimals={quoteTokenDecimals}
              />
            )
          }
        />
        <SimpleTableRow
          label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
          value={
            isInfiniteRange ? (
              <span className="text-xs font-medium">∞</span>
            ) : (
              <AmountRenderer
                value={maximumPrice}
                suffix={pool.base}
                decimals={quoteTokenDecimals}
              />
            )
          }
        />
      </SimpleTable>
    </>
  );
};
