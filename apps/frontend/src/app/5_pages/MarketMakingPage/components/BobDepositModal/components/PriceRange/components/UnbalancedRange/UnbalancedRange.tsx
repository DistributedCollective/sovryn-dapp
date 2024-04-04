import React, { FC, useCallback, useEffect } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../../../locales/i18n';
import { POOL_ASSET_A, POOL_ASSET_B } from '../../../../BobDepositModal';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
import { useGetPoolInfo } from '../../../../hooks/useGetPoolInfo';
import { Input } from './components/Input/Input';

export const UnbalancedRange: FC = () => {
  const {
    // rangeWidth,
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
  console.log(`current price: ${currentPrice} g`);

  // const priceDifferenceLowerBoundary = useMemo(
  //   () =>
  //     Decimal.from(currentPrice).mul(
  //       Decimal.from(lowerBoundaryPercentage).div(100),
  //     ),
  //   [currentPrice, lowerBoundaryPercentage],
  // );

  // const priceDifferenceUpperBoundary = useMemo(
  //   () =>
  //     Decimal.from(currentPrice).mul(
  //       Decimal.from(upperBoundaryPercentage).div(100),
  //     ),
  //   [currentPrice, upperBoundaryPercentage],
  // );

  console.log(`lowerBoundaryPercentage: ${lowerBoundaryPercentage}`);

  const onMinPriceMinusClick = useCallback(() => {
    setLowerBoundaryPrice(previousValue => previousValue - 10);
    setLowerBoundaryPercentage(previousValue => previousValue - 1);
  }, [setLowerBoundaryPercentage, setLowerBoundaryPrice]);

  const onMinPricePlusClick = useCallback(() => {
    setLowerBoundaryPrice(previousValue => previousValue + 10);
    setLowerBoundaryPercentage(previousValue => previousValue + 1);
  }, [setLowerBoundaryPercentage, setLowerBoundaryPrice]);

  const onMaxPriceMinusClick = useCallback(() => {
    setUpperBoundaryPrice(previousValue => previousValue - 10);
    setUpperBoundaryPercentage(previousValue => previousValue - 1);
  }, [setUpperBoundaryPercentage, setUpperBoundaryPrice]);

  const onMaxPricePlusClick = useCallback(() => {
    setUpperBoundaryPrice(previousValue => previousValue + 10);
    setUpperBoundaryPercentage(previousValue => previousValue + 1);
  }, [setUpperBoundaryPercentage, setUpperBoundaryPrice]);

  useEffect(() => {
    if (lowerBoundaryPrice === 0) {
      setLowerBoundaryPrice(currentPrice);
    }

    if (upperBoundaryPrice === 0) {
      setUpperBoundaryPrice(currentPrice);
    }
  }, [
    currentPrice,
    lowerBoundaryPrice,
    setLowerBoundaryPrice,
    setUpperBoundaryPrice,
    upperBoundaryPrice,
  ]);

  // useEffect(() => {
  //   if (
  //     rangeWidth !== lowerBoundaryPercentage ||
  //     rangeWidth !== upperBoundaryPercentage
  //   ) {
  //     setLowerBoundaryPercentage(rangeWidth);
  //     setUpperBoundaryPercentage(rangeWidth);
  //   }
  // }, [
  //   lowerBoundaryPercentage,
  //   rangeWidth,
  //   setLowerBoundaryPercentage,
  //   setUpperBoundaryPercentage,
  //   upperBoundaryPercentage,
  // ]);

  return (
    <div className="flex justify-between px-4">
      <Input
        label={t(translations.bobMarketMakingPage.depositModal.minPrice)}
        onMinusClick={onMinPriceMinusClick}
        onPlusClick={onMinPricePlusClick}
        value={lowerBoundaryPrice}
        range={lowerBoundaryPercentage}
        isLowerBoundary
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
