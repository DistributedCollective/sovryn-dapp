import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { SupportedTokens } from '@sovryn/contracts';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../../../../../utils/math';
import {
  getConvertedValue,
  getCurrencyPrecision,
} from '../../../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { EcosystemContracts } from '../../EcosystemStatistics.types';
import {
  PoolData,
  EcosystemStatisticsProps,
} from '../../EcosystemStatistics.types';
import { MyntAggregatorContractLiquidity } from './MyntAggregatorContractLiquidity/MyntAggregatorContractLiquidity';

const availablePools = [SupportedTokens.zusd, SupportedTokens.doc];

export const MyntAggregatorContract: FC<EcosystemStatisticsProps> = ({
  selectedCurrency,
  onChange,
  btcPrice,
}) => {
  const [poolsData, setPoolsData] = useState<PoolData>({});

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
    onChange(EcosystemContracts.MyntAggregatorContracts, decimalic(balance));
  }, [balance, onChange]);

  return (
    <>
      {availablePools.map(pool => (
        <MyntAggregatorContractLiquidity
          key={pool}
          pool={pool}
          onChange={onValueChange}
        />
      ))}
      <AmountRenderer
        value={balance}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        dataAttribute="ecosystem-statistics-mynt-aggregator-contract-value"
      />
    </>
  );
};
