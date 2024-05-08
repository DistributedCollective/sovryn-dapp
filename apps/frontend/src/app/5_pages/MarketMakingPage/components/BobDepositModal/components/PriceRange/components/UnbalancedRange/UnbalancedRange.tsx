import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { toDisplayPrice } from '@sovryn/sdex';
import { Decimal } from '@sovryn/utils';

import { translations } from '../../../../../../../../../locales/i18n';
import { AmbientLiquidityPool } from '../../../../../AmbientMarketMaking/utils/AmbientLiquidityPool';
import { useGetTokenDecimals } from '../../../../../BobWIthdrawModal/hooks/useGetTokenDecimals';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { Input } from './components/Input/Input';

type UnbalancedRangeProps = {
  pool: AmbientLiquidityPool;
};

export const UnbalancedRange: FC<UnbalancedRangeProps> = ({ pool }) => {
  const {
    minimumPrice,
    lowerBoundaryPercentage,
    maximumPrice,
    upperBoundaryPercentage,
    setMinimumPrice,
    setLowerBoundaryPercentage,
    setMaximumPrice,
    setUpperBoundaryPercentage,
    spotPrice,
  } = useDepositContext();

  const { spotPrice: currentPrice, poolTokens } = useGetPoolInfo(
    pool.base,
    pool.quote,
  );

  const { baseTokenDecimals, quoteTokenDecimals } = useGetTokenDecimals(
    poolTokens?.tokenA,
    poolTokens?.tokenB,
  );

  const calculatePrice = useCallback(
    (percentage: number) =>
      Decimal.from(currentPrice)
        .add(Decimal.from(currentPrice).mul(Decimal.from(percentage).div(100)))
        .toNumber(),
    [currentPrice],
  );

  const updateRange = useCallback(
    (isUpperBoundary: boolean, isPlus: boolean) => {
      const currentPercentage = isUpperBoundary
        ? upperBoundaryPercentage
        : lowerBoundaryPercentage;

      const newPercentage = isPlus
        ? currentPercentage + 1
        : currentPercentage - 1;

      const newPrice =
        newPercentage < 0 ? currentPrice : calculatePrice(newPercentage);

      if (isUpperBoundary) {
        if (newPrice > minimumPrice) {
          setUpperBoundaryPercentage(newPercentage);
          setMaximumPrice(newPrice);
        }
      } else {
        if (newPrice < maximumPrice) {
          setLowerBoundaryPercentage(newPercentage);
          setMinimumPrice(newPrice);
        }
      }
    },
    [
      calculatePrice,
      currentPrice,
      lowerBoundaryPercentage,
      maximumPrice,
      minimumPrice,
      setLowerBoundaryPercentage,
      setMaximumPrice,
      setMinimumPrice,
      setUpperBoundaryPercentage,
      upperBoundaryPercentage,
    ],
  );

  const onMinPriceMinusClick = useCallback(() => {
    updateRange(false, false);
  }, [updateRange]);

  const onMinPricePlusClick = useCallback(() => {
    updateRange(false, true);
  }, [updateRange]);

  const onMaxPriceMinusClick = useCallback(() => {
    updateRange(true, false);
  }, [updateRange]);

  const onMaxPricePlusClick = useCallback(() => {
    updateRange(true, true);
  }, [updateRange]);

  useEffect(() => {
    const calculatedMinimumPrice = calculatePrice(lowerBoundaryPercentage);
    const calculatedMaximumPrice = calculatePrice(upperBoundaryPercentage);

    if (minimumPrice === 0 || calculatedMinimumPrice !== minimumPrice) {
      setMinimumPrice(calculatedMinimumPrice);
    }

    if (maximumPrice === 0 || calculatedMaximumPrice !== maximumPrice) {
      setMaximumPrice(calculatedMaximumPrice);
    }
  }, [
    calculatePrice,
    lowerBoundaryPercentage,
    maximumPrice,
    minimumPrice,
    setMaximumPrice,
    setMinimumPrice,
    upperBoundaryPercentage,
  ]);

  const renderMin = useMemo(
    () =>
      toDisplayPrice(
        spotPrice * ((100 + upperBoundaryPercentage) / 100),
        baseTokenDecimals,
        quoteTokenDecimals,
      ),
    [baseTokenDecimals, quoteTokenDecimals, spotPrice, upperBoundaryPercentage],
  );

  const renderMax = useMemo(
    () =>
      toDisplayPrice(
        spotPrice * ((100 + lowerBoundaryPercentage) / 100),
        baseTokenDecimals,
        quoteTokenDecimals,
      ),
    [baseTokenDecimals, lowerBoundaryPercentage, quoteTokenDecimals, spotPrice],
  );

  return (
    <div className="flex justify-between px-4">
      <Input
        label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
        onMinusClick={onMinPriceMinusClick}
        onPlusClick={onMinPricePlusClick}
        value={minimumPrice}
        text={renderMax}
        range={lowerBoundaryPercentage}
        decimals={quoteTokenDecimals}
      />

      <Input
        label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
        onMinusClick={onMaxPriceMinusClick}
        onPlusClick={onMaxPricePlusClick}
        value={maximumPrice}
        text={renderMin}
        range={upperBoundaryPercentage}
        decimals={quoteTokenDecimals}
      />
    </div>
  );
};
