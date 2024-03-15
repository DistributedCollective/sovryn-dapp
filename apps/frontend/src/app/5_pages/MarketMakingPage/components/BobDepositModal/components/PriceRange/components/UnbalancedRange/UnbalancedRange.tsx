import React, { FC, useCallback } from 'react';

import { t } from 'i18next';

import { translations } from '../../../../../../../../../locales/i18n';
import { Input } from './components/Input/Input';

type UnbalancedRangeProps = {
  lowerBoundaryPrice: number;
  upperBoundaryPrice: number;
  lowerBoundaryPercentage: number;
  upperBoundaryPercentage: number;
};

export const UnbalancedRange: FC<UnbalancedRangeProps> = ({
  lowerBoundaryPercentage,
  lowerBoundaryPrice,
  upperBoundaryPercentage,
  upperBoundaryPrice,
}) => {
  const onMinPriceMinusClick = useCallback(() => {
    console.log(`min price minus click`);
  }, []);

  const onMinPricePlusClick = useCallback(() => {
    console.log(`min price plus click`);
  }, []);

  const onMaxPriceMinusClick = useCallback(() => {
    console.log(`max price minus click`);
  }, []);

  const onMaxPricePlusClick = useCallback(() => {
    console.log(`max price plus click`);
  }, []);

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
