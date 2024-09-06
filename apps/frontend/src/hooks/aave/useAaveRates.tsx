import { useEffect, useMemo, useState } from 'react';

import { Contract, utils } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useSearchParams } from 'react-router-dom';

import { useAccount } from '../useAccount';
import {
  BIG_NUMBER_PRECISION_EIGHTEEN,
  BIG_NUMBER_PRECISION_TWENTY_SEVEN,
} from './constants';
import { Reserve, useAaveReservesData } from './useAaveReservesData';

const INTEREST_RATE_STRATEGY_ABI = [
  {
    inputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'optimalUsageRatio',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'baseVariableBorrowRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'variableRateSlope1',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'variableRateSlope2',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ADDRESSES_PROVIDER',
    outputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_EXCESS_USAGE_RATIO',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'OPTIMAL_USAGE_RATIO',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'unbacked',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidityAdded',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidityTaken',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalVariableDebt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactor',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'reserve',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'aToken',
            type: 'address',
          },
        ],
        internalType: 'struct DataTypes.CalculateInterestRatesParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'calculateInterestRates',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBaseVariableBorrowRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMaxVariableBorrowRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVariableRateSlope1',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVariableRateSlope2',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface RatesDataResult {
  currentUsageRatio: string;
  optimalUsageRatio: string;
  baseVariableBorrowRate: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  underlyingAsset: string;
  name: string;
  symbol: string;
  decimals: string;
}

const calculateUtilizationRate = (
  decimals: number,
  totalDebt: string,
  availableLiquidity: string,
): bigint => {
  // Create BigNumber instances
  const totalBorrow = BigInt(utils.parseUnits(totalDebt, decimals).toString());
  const totalSupply = BigInt(availableLiquidity) + totalBorrow;
  // Perform division
  return (totalBorrow * BigInt(10 ** 18)) / totalSupply;
};

export const useAaveInterestRatesData = (): {
  data: RatesDataResult | null;
  error: string | null;
} => {
  const [data, setData] = useState<RatesDataResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { provider } = useAccount();

  const [searchParams] = useSearchParams();
  const symbol = searchParams.get('asset') || 'ETH';
  const { reserves, loading } = useAaveReservesData();
  const reserve: Reserve | undefined = reserves.find(
    r => r.symbol.toLocaleLowerCase() === symbol.toLocaleLowerCase(),
  );
  const interestRateStrategyAddress = reserve?.interestRateStrategyAddress;

  const rateContract = useMemo(
    () =>
      provider && interestRateStrategyAddress && !loading
        ? new Contract(
            interestRateStrategyAddress,
            INTEREST_RATE_STRATEGY_ABI,
            provider,
          )
        : null,
    [loading, interestRateStrategyAddress, provider],
  );

  useEffect(() => {
    if (loading || !rateContract || !reserve) return;
    let ratesData: RatesDataResult;
    try {
      const utilizationRate = calculateUtilizationRate(
        reserve.decimals,
        reserve.totalDebt,
        reserve.availableLiquidity,
      );
      ratesData = {
        currentUsageRatio: formatUnits(
          utilizationRate,
          BIG_NUMBER_PRECISION_EIGHTEEN,
        ),
        optimalUsageRatio: formatUnits(
          reserve.optimalUsageRatio,
          BIG_NUMBER_PRECISION_TWENTY_SEVEN,
        ).toString(),
        baseVariableBorrowRate: formatUnits(
          reserve.baseVariableBorrowRate,
          BIG_NUMBER_PRECISION_TWENTY_SEVEN,
        ).toString(),
        variableRateSlope1: formatUnits(
          reserve.variableRateSlope1,
          BIG_NUMBER_PRECISION_TWENTY_SEVEN,
        ).toString(),
        variableRateSlope2: formatUnits(
          reserve.variableRateSlope2,
          BIG_NUMBER_PRECISION_TWENTY_SEVEN,
        ).toString(),
        underlyingAsset: reserve.underlyingAsset,
        name: reserve.name,
        symbol: reserve.symbol,
        decimals: reserve.decimals.toString(),
      };
      setData(ratesData);
    } catch (error) {
      setError(error.message);
    }
  }, [symbol, loading, reserve, rateContract]);

  return { data, error };
};
