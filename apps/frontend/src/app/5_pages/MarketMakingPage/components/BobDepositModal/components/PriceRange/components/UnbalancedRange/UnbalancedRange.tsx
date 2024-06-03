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
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
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

      const newPercentage =
        currentPercentage + (isPlus ? 1 : -1) || (isPlus ? 1 : -1);

      const newPrice = calculatePrice(newPercentage);

      if (isUpperBoundary) {
        setUpperBoundaryPercentage(newPercentage);
        setMaximumPrice(newPrice);
      } else {
        setLowerBoundaryPercentage(newPercentage);
        setMinimumPrice(newPrice);
      }
    },
    [
      calculatePrice,
      lowerBoundaryPercentage,
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

  const isInputADisabled = useMemo(() => {
    if (!minimumPrice || !maximumPrice || !currentPrice) {
      return false;
    }

    return minimumPrice >= currentPrice && maximumPrice >= currentPrice;
  }, [currentPrice, maximumPrice, minimumPrice]);

  const isInputBDisabled = useMemo(() => {
    if (!minimumPrice || !maximumPrice || !currentPrice) {
      return false;
    }

    return minimumPrice <= currentPrice && maximumPrice <= currentPrice;
  }, [currentPrice, maximumPrice, minimumPrice]);

  useEffect(() => {
    setIsFirstAssetOutOfRange(isInputADisabled);
    setIsSecondAssetOutOfRange(isInputBDisabled);
  }, [
    isInputADisabled,
    isInputBDisabled,
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
  ]);

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

  useEffect(() => {
    if (minimumPrice > maximumPrice) {
      setIsFirstAssetOutOfRange(true);
      setIsSecondAssetOutOfRange(true);
    } else {
      setIsFirstAssetOutOfRange(isInputADisabled);
      setIsSecondAssetOutOfRange(isInputBDisabled);
    }
  }, [
    minimumPrice,
    maximumPrice,
    isInputADisabled,
    isInputBDisabled,
    setIsFirstAssetOutOfRange,
    setIsSecondAssetOutOfRange,
  ]);

  const renderMin = useMemo(
    () =>
      toDisplayPrice(
        currentPrice * ((100 - lowerBoundaryPercentage) / 100),
        baseTokenDecimals,
        quoteTokenDecimals,
        true,
      ),
    [
      baseTokenDecimals,
      lowerBoundaryPercentage,
      quoteTokenDecimals,
      currentPrice,
    ],
  );

  const renderMax = useMemo(
    () =>
      toDisplayPrice(
        currentPrice * ((100 - upperBoundaryPercentage) / 100),
        baseTokenDecimals,
        quoteTokenDecimals,
        true,
      ),
    [
      baseTokenDecimals,
      quoteTokenDecimals,
      currentPrice,
      upperBoundaryPercentage,
    ],
  );

  return (
    <div className="flex justify-between px-4">
      <Input
        label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
        onMinusClick={onMinPriceMinusClick}
        onPlusClick={onMinPricePlusClick}
        value={minimumPrice}
        text={renderMin}
        range={lowerBoundaryPercentage}
        decimals={quoteTokenDecimals}
      />

      <Input
        label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
        onMinusClick={onMaxPriceMinusClick}
        onPlusClick={onMaxPricePlusClick}
        value={maximumPrice}
        text={renderMax}
        range={upperBoundaryPercentage}
        decimals={quoteTokenDecimals}
      />
    </div>
  );
};
