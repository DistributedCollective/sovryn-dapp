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
    lowerBoundaryPrice,
    lowerBoundaryPercentage,
    upperBoundaryPrice,
    upperBoundaryPercentage,
    setLowerBoundaryPrice,
    setLowerBoundaryPercentage,
    setUpperBoundaryPrice,
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
        setUpperBoundaryPrice(newPrice);
      } else {
        setLowerBoundaryPercentage(newPercentage);
        setLowerBoundaryPrice(newPrice);
      }
    },
    [
      calculatePrice,
      currentPrice,
      lowerBoundaryPercentage,
      setLowerBoundaryPercentage,
      setLowerBoundaryPrice,
      setUpperBoundaryPercentage,
      setUpperBoundaryPrice,
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
    if (lowerBoundaryPrice === 0) {
      setLowerBoundaryPrice(calculatePrice(lowerBoundaryPercentage));
    }

    if (upperBoundaryPrice === 0) {
      setUpperBoundaryPrice(calculatePrice(upperBoundaryPercentage));
    }
  }, [
    calculatePrice,
    lowerBoundaryPercentage,
    lowerBoundaryPrice,
    setLowerBoundaryPrice,
    setUpperBoundaryPrice,
    upperBoundaryPercentage,
    upperBoundaryPrice,
  ]);

  return (
    <div className="flex justify-between px-4">
      <Input
        label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
        onMinusClick={onMinPriceMinusClick}
        onPlusClick={onMinPricePlusClick}
        value={lowerBoundaryPrice}
        range={lowerBoundaryPercentage}
      />

      <Input
        label={t(translations.bobMarketMakingPage.depositModal.maxPrice)}
        onMinusClick={onMaxPriceMinusClick}
        onPlusClick={onMaxPricePlusClick}
        value={upperBoundaryPrice}
        range={upperBoundaryPercentage}
      />
    </div>
  );
};
