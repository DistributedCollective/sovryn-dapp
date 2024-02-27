import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { decimalic } from '../../../../../../../utils/math';
import { AmmLiquidityPoolDictionary } from '../../../../../MarketMakingPage/utils/AmmLiquidityPoolDictionary';
import {
  getConvertedValue,
  getCurrencyPrecision,
} from '../../../../../PortfolioPage/components/ProtocolSection/ProtocolSection.utils';
import { EcosystemContracts } from '../../EcosystemStatistics.types';
import {
  PoolData,
  EcosystemStatisticsProps,
} from '../../EcosystemStatistics.types';
import { AmmContractLiquidity } from './components/AmmContractLiquidity/AmmContractLiquidity';

const ammPools = AmmLiquidityPoolDictionary.list();

export const AmmContracts: FC<EcosystemStatisticsProps> = ({
  selectedCurrency,
  btcPrice,
  onChange,
}) => {
  const [poolsData, setPoolsData] = useState<PoolData>({});

  const onValueChange = useCallback((asset: string, balance: Decimal) => {
    setPoolsData(prevBalances => {
      const newBalances = { ...prevBalances, [asset]: balance };
      return newBalances;
    });
  }, []);

  const calculateBalance = useCallback(
    () =>
      Object.values(poolsData).reduce(
        (total, balance) => total.add(balance),
        Decimal.ZERO,
      ),
    [poolsData],
  );

  const renderBalance = useMemo(
    () => getConvertedValue(calculateBalance(), selectedCurrency, btcPrice),
    [calculateBalance, selectedCurrency, btcPrice],
  );

  useEffect(() => {
    onChange(EcosystemContracts.AmmContracts, decimalic(renderBalance));
  }, [renderBalance, onChange]);

  return (
    <>
      {ammPools.map(pool => (
        <AmmContractLiquidity
          key={pool.key}
          pool={pool}
          onChange={onValueChange}
        />
      ))}
      <AmountRenderer
        value={renderBalance}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        dataAttribute="ecosystem-statistics-amm-contracts-value"
      />
    </>
  );
};
