import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { toDisplayPrice } from '@sovryn/sdex';
import {
  Button,
  ButtonStyle,
  SimpleTable,
  SimpleTableRow,
  Slider,
} from '@sovryn/ui';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { translations } from '../../../../../../../../../locales/i18n';
import { calculateBoundedPrice } from '../../../../../AmbientMarketMaking/components/AmbientPoolPositions/AmbientPoolPositions.utils';
import { AmbientLiquidityPool } from '../../../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useGetTokenDecimals } from '../../../../../BobWIthdrawModal/hooks/useGetTokenDecimals';
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

  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  useEffect(() => {
    setMinimumPrice(calculateBoundedPrice(true, rangeWidth, currentPrice));
    setMaximumPrice(calculateBoundedPrice(false, rangeWidth, currentPrice));
  }, [rangeWidth, setMaximumPrice, setMinimumPrice, currentPrice]);

  const onRangeChange = useCallback(
    (value: number | number[]) => {
      if (typeof value === 'number') {
        setMinimumPrice(calculateBoundedPrice(true, value, currentPrice));
        setMaximumPrice(calculateBoundedPrice(false, value, currentPrice));
        setRangeWidth(value);
      }
    },
    [setMaximumPrice, setMinimumPrice, setRangeWidth, currentPrice],
  );

  const renderMin = useMemo(
    () =>
      toDisplayPrice(maximumPrice, baseTokenDecimals, quoteTokenDecimals, true),
    [baseTokenDecimals, maximumPrice, quoteTokenDecimals],
  );

  const renderMax = useMemo(
    () =>
      toDisplayPrice(minimumPrice, baseTokenDecimals, quoteTokenDecimals, true),
    [baseTokenDecimals, minimumPrice, quoteTokenDecimals],
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
              <AmountRenderer value={renderMin} suffix={pool.quote} />
            )
          }
        />
        <SimpleTableRow
          label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
          value={
            isInfiniteRange ? (
              <span className="text-xs font-medium">∞</span>
            ) : (
              <AmountRenderer value={renderMax} suffix={pool.quote} />
            )
          }
        />
      </SimpleTable>
    </>
  );
};
