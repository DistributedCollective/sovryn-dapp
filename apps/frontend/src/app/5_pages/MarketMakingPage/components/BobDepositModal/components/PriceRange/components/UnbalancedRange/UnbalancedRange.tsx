import React, { FC, useCallback, useEffect } from 'react';

import { t } from 'i18next';

import { Decimal } from '@sovryn/utils';

import { translations } from '../../../../../../../../../locales/i18n';
import { POOL_ASSET_A, POOL_ASSET_B } from '../../../../BobDepositModal';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { Input } from './components/Input/Input';

export const UnbalancedRange: FC = () => {
  const {
    minimumPrice,
    lowerBoundaryPercentage,
    maximumPrice,
    upperBoundaryPercentage,
    setMinimumPrice,
    setLowerBoundaryPercentage,
    setMaximumPrice,
    setUpperBoundaryPercentage,
  } = useDepositContext();

  const { price: currentPrice } = useGetPoolInfo(POOL_ASSET_A, POOL_ASSET_B);

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
        newPercentage === 0 ? currentPrice : calculatePrice(newPercentage);

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
      currentPrice,
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

  useEffect(() => {
    if (minimumPrice === 0) {
      setMinimumPrice(calculatePrice(lowerBoundaryPercentage));
    }

    if (maximumPrice === 0) {
      setMaximumPrice(calculatePrice(upperBoundaryPercentage));
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

  return (
    <div className="flex justify-between px-4">
      <Input
        label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
        onMinusClick={onMinPriceMinusClick}
        onPlusClick={onMinPricePlusClick}
        value={minimumPrice}
        range={lowerBoundaryPercentage}
      />

      <Input
        label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
        onMinusClick={onMaxPriceMinusClick}
        onPlusClick={onMaxPricePlusClick}
        value={maximumPrice}
        range={upperBoundaryPercentage}
      />
    </div>
  );
};
