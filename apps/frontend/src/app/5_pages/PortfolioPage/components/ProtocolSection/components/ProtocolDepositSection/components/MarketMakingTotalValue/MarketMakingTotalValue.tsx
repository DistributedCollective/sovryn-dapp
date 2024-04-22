import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { ChainIds } from '@sovryn/ethers-provider';
import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { isBobChain } from '../../../../../../../../../utils/chain';
import { AmmLiquidityPoolDictionary } from '../../../../../../../MarketMakingPage/utils/AmmLiquidityPoolDictionary';
import {
  ProtocolTypes,
  PoolValues,
  ProtocolSectionProps,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';
import { MarketMakingPoolBalance } from './components/MarketMakingPoolBalance';

const ammPools = AmmLiquidityPoolDictionary.list();

export const MarketMakingTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  btcPrice,
  onValueChange,
}) => {
  const { account } = useAccount();
  const { value: block } = useBlockNumber();
  const [poolValues, setPoolValues] = useState<PoolValues>({});
  const [addedPools, setAddedPools] = useState<Set<string>>(new Set());
  const chainId = useCurrentChain();

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
            chainId,
          )
        : 0,
    [account, poolValues, selectedCurrency, btcPrice, chainId],
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
    if (totalBalance.gt(Decimal.ZERO) && account) {
      onValueChange(totalBalance, ProtocolTypes.MARKET_MAKING);
    }
  }, [poolValues, onValueChange, account, totalBalance]);

  useEffect(() => {
    if (!account || totalBalance.isZero()) {
      onValueChange(Decimal.ZERO, ProtocolTypes.MARKET_MAKING);
    }
  }, [account, onValueChange, totalBalance]);

  if (isBobChain(chainId) || chainId === ChainIds.SEPOLIA) {
    return (
      <AmountRenderer
        value={0}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        isAnimated
      />
    );
  }

  return (
    <>
      {ammPools.map((pool, index) => (
        <MarketMakingPoolBalance
          key={index}
          pool={pool}
          onBalanceChange={newBalance =>
            handleBalanceUpdate(newBalance, pool.assetA)
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
