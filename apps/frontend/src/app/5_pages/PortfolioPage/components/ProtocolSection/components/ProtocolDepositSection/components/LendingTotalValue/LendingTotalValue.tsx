import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { LendingPoolDictionary } from '../../../../../../../../../utils/LendingPoolDictionary';
import {
  ProtocolTypes,
  PoolValues,
  ProtocolSectionProps,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';
import { LendingPoolBalance } from './components/LendingPoolBalance';

const lendPools = LendingPoolDictionary.list();

export const LendingTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  btcPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();

  const [poolValues, setPoolValues] = useState<PoolValues>({});
  const [addedPools, setAddedPools] = useState<Set<string>>(new Set());

  const handleBalanceUpdate = useCallback(
    (newBalance: Decimal, poolId: string) => {
      setPoolValues(prevBalances => {
        if (addedPools.has(poolId) && newBalance.eq(prevBalances[poolId])) {
          return prevBalances;
        }
        setAddedPools(prevAddedPools => new Set(prevAddedPools).add(poolId));
        return {
          ...prevBalances,
          [poolId]: newBalance,
        };
      });
    },
    [addedPools],
  );

  const renderTotalBalance = useMemo(
    () =>
      account
        ? getConvertedValue(
            Object.values(poolValues).reduce(
              (total, balance) => total.add(balance),
              Decimal.ZERO,
            ),
            selectedCurrency,
            btcPrice,
          )
        : 0,
    [poolValues, selectedCurrency, btcPrice, account],
  );

  const totalBalance = useMemo(
    () =>
      Object.values(poolValues).reduce(
        (total, balance) => total.add(balance),
        Decimal.ZERO,
      ),
    [poolValues],
  );

  useEffect(() => {
    onValueChange(totalBalance, ProtocolTypes.LENDING);
  }, [onValueChange, block, totalBalance]);

  return (
    <>
      {lendPools.map((pool, index) => (
        <LendingPoolBalance
          key={index}
          pool={pool}
          onBalanceChange={newBalance =>
            handleBalanceUpdate(newBalance, pool.getAsset())
          }
          block={block}
        />
      ))}
      <AmountRenderer
        value={renderTotalBalance}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        isAnimated
      />
    </>
  );
};
