import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { LendingPoolDictionary } from '../../../../../../../utils/LendingPoolDictionary';
import { decimalic } from '../../../../../../../utils/math';
import { EXCLUDED_ASSETS } from '../../../../../BorrowPage/components/BorrowAssetsTable/BorrowAssetsTable.constants';
import {
  getConvertedValue,
  getCurrencyPrecision,
} from '../../../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { EcosystemContracts } from '../../EcosystemStatistics.types';
import {
  PoolData,
  EcosystemStatisticsProps,
} from '../../EcosystemStatistics.types';
import { LendingContractLiquidity } from './components/LendingContractLiquidity/LendingContractLiquidity';

const lendPools = LendingPoolDictionary.list();

export const LendingContracts: FC<EcosystemStatisticsProps> = ({
  selectedCurrency,
  btcPrice,
  onChange,
}) => {
  const [poolsData, setPoolsData] = useState<PoolData>({});

  const availablePools = useMemo(
    () => lendPools.filter(pool => !EXCLUDED_ASSETS.includes(pool.getAsset())),
    [],
  );

  const onValueChange = useCallback((asset: string, balance: Decimal) => {
    setPoolsData(prevBalances => {
      const newBalances = { ...prevBalances, [asset]: balance };
      return newBalances;
    });
  }, []);

  const balance = useMemo(() => {
    const calculateBalance = Object.values(poolsData).reduce(
      (total, balance) => total.add(balance),
      Decimal.ZERO,
    );

    return getConvertedValue(calculateBalance, selectedCurrency, btcPrice);
  }, [poolsData, selectedCurrency, btcPrice]);

  useEffect(() => {
    onChange(EcosystemContracts.LendingContracts, decimalic(balance));
  }, [balance, onChange]);

  return (
    <>
      {availablePools.map(pool => (
        <LendingContractLiquidity
          key={pool.getAsset()}
          pool={pool}
          onChange={onValueChange}
        />
      ))}
      <AmountRenderer
        value={balance}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        dataAttribute="ecosystem-statistics-protocol-contracts-value"
      />
    </>
  );
};
