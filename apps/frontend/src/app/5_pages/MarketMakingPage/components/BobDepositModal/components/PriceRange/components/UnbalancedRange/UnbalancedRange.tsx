import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../../../locales/i18n';
import { useDepositContext } from '../../../../contexts/BobDepositModalContext';
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
