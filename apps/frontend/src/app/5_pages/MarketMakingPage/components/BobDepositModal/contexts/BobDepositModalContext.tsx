import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import { noop } from '@sovryn/ui';

import {
  DEFAULT_RANGE_WIDTH,
  DEFAULT_SLIPPAGE,
} from '../BobDepositModal.constants';
import { DepositContextValue } from './BobDepositModalContext.types';

const defaultContextValue: DepositContextValue = {
  rangeWidth: DEFAULT_RANGE_WIDTH,
  setRangeWidth: noop,
  lowerBoundaryPrice: 0,
  setLowerBoundaryPrice: noop,
  upperBoundaryPrice: 0,
  setUpperBoundaryPrice: noop,
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
};

const DepositContext = createContext<DepositContextValue>(defaultContextValue);

export const useDepositContext = () =>
  useContext(DepositContext) as DepositContextValue;

export const DepositContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [rangeWidth, setRangeWidth] = useState(defaultContextValue.rangeWidth);
  const [lowerBoundaryPrice, setLowerBoundaryPrice] = useState(
    defaultContextValue.lowerBoundaryPrice,
  );
  const [lowerBoundaryPercentage, setLowerBoundaryPercentage] = useState(
    defaultContextValue.lowerBoundaryPercentage,
  );
  const [upperBoundaryPrice, setUpperBoundaryPrice] = useState(
    defaultContextValue.upperBoundaryPrice,
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

  return (
    <DepositContext.Provider
      value={{
        rangeWidth,
        setRangeWidth,
        lowerBoundaryPrice,
        setLowerBoundaryPrice,
        lowerBoundaryPercentage,
        setLowerBoundaryPercentage,
        upperBoundaryPrice,
        setUpperBoundaryPrice,
        upperBoundaryPercentage,
        setUpperBoundaryPercentage,
        maximumSlippage,
        setMaximumSlippage,
        firstAssetValue,
        setFirstAssetValue,
        secondAssetValue,
        setSecondAssetValue,
      }}
    >
      {children}
    </DepositContext.Provider>
  );
};
