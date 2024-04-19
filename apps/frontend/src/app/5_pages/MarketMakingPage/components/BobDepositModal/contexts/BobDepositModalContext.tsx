import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  baseConcFactor,
  concDepositSkew,
  priceToTick,
  quoteConcFactor,
} from '@sovryn/sdex';
import { noop } from '@sovryn/ui';

import {
  DEFAULT_RANGE_WIDTH,
  DEFAULT_SLIPPAGE,
} from '../BobDepositModal.constants';
import { DepositContextValue } from './BobDepositModalContext.types';

const defaultContextValue: DepositContextValue = {
  rangeWidth: DEFAULT_RANGE_WIDTH,
  setRangeWidth: noop,
  minimumPrice: 0,
  setMinimumPrice: noop,
  maximumPrice: 0,
  setMaximumPrice: noop,
  lowerBoundaryPercentage: DEFAULT_RANGE_WIDTH * -1,
  setLowerBoundaryPercentage: noop,
  upperBoundaryPercentage: DEFAULT_RANGE_WIDTH,
  setUpperBoundaryPercentage: noop,
  maximumSlippage: DEFAULT_SLIPPAGE,
  setMaximumSlippage: noop,
  firstAssetValue: '',
  setFirstAssetValue: noop,
  secondAssetValue: '',
  setSecondAssetValue: noop,
  isBalancedRange: true,
  setIsBalancedRange: noop,
  spotPrice: 0,
  setSpotPrice: noop,
  concData: {
    base: 0, // if base is infinite - base token deposit is not required (isTokenAPrimaryRange=false)
    quote: 0, // if quote is infinite - quote token deposit is not required (isTokenAPrimaryRange=true)
    skew: 0, // The ratio of base to quote token deposit amounts for this concentrated range order *relative* to full-range ambient deposit ratio.
  },
  setConcData: noop,
};

const DepositContext = createContext<DepositContextValue>(defaultContextValue);

export const useDepositContext = () =>
  useContext(DepositContext) as DepositContextValue;

export const DepositContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [rangeWidth, setRangeWidth] = useState(defaultContextValue.rangeWidth);
  const [minimumPrice, setMinimumPrice] = useState(
    defaultContextValue.minimumPrice,
  );
  const [lowerBoundaryPercentage, setLowerBoundaryPercentage] = useState(
    defaultContextValue.lowerBoundaryPercentage,
  );
  const [maximumPrice, setMaximumPrice] = useState(
    defaultContextValue.maximumPrice,
  );
  const [upperBoundaryPercentage, setUpperBoundaryPercentage] = useState(
    defaultContextValue.upperBoundaryPercentage,
  );
  const [maximumSlippage, setMaximumSlippage] = useState(
    defaultContextValue.maximumSlippage,
  );
  const [firstAssetValue, setFirstAssetValue] = useState(
    defaultContextValue.firstAssetValue,
  );
  const [secondAssetValue, setSecondAssetValue] = useState(
    defaultContextValue.secondAssetValue,
  );
  const [isBalancedRange, setIsBalancedRange] = useState(
    defaultContextValue.isBalancedRange,
  );
  const [spotPrice, setSpotPrice] = useState(defaultContextValue.spotPrice);
  const [concData, setConcData] = useState(defaultContextValue.concData);

  useEffect(() => {
    const tick = {
      low: priceToTick(minimumPrice),
      high: priceToTick(maximumPrice),
    };

    const quoteFactor = quoteConcFactor(spotPrice, minimumPrice, maximumPrice);
    const baseFactor = baseConcFactor(spotPrice, minimumPrice, maximumPrice);
    const skew = concDepositSkew(spotPrice, minimumPrice, maximumPrice);

    // todo: leave it for debugging while testing stuff
    console.log({ spotPrice, quoteFactor, baseFactor, skew, tick });

    setConcData({
      base: baseFactor,
      quote: quoteFactor,
      skew,
    });
  }, [minimumPrice, maximumPrice, spotPrice]);

  return (
    <DepositContext.Provider
      value={{
        rangeWidth,
        setRangeWidth,
        minimumPrice,
        setMinimumPrice,
        lowerBoundaryPercentage,
        setLowerBoundaryPercentage,
        maximumPrice,
        setMaximumPrice,
        upperBoundaryPercentage,
        setUpperBoundaryPercentage,
        maximumSlippage,
        setMaximumSlippage,
        firstAssetValue,
        setFirstAssetValue,
        secondAssetValue,
        setSecondAssetValue,
        isBalancedRange,
        setIsBalancedRange,
        spotPrice,
        setSpotPrice,
        concData,
        setConcData,
      }}
    >
      {children}
    </DepositContext.Provider>
  );
};
