import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../../../../../hooks/useBlockNumber';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { AmbientPosition } from '../../../../../../../MarketMakingPage/components/AmbientMarketMaking/AmbientMarketMaking.types';
import { AmbientLiquidityPoolDictionary } from '../../../../../../../MarketMakingPage/components/AmbientMarketMaking/utils/AmbientLiquidityPoolDictionary';
import {
  ProtocolTypes,
  ProtocolSectionProps,
} from '../../../../ProtocolSection.types';
import {
  getCurrencyPrecision,
  getConvertedValue,
} from '../../../../ProtocolSection.utils';
import { PositionValues } from './AmbientMarketMakingTotalValue.types';
import { AmbientMarketMakingPositions } from './components/AmbientMarketMakingPositions';

export const AmbientMarketMakingTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  nativeTokenPrice,
  onValueChange,
}) => {
  const { value: block } = useBlockNumber();
  const chainId = useCurrentChain();
  const ammPools = useMemo(
    () => AmbientLiquidityPoolDictionary.list(chainId),
    [chainId],
  );
  const { account } = useAccount();
  const [positionValues, setPositionValues] = useState<PositionValues>({});

  const handleBalanceUpdate = useCallback(
    (newBalance: Decimal, position: AmbientPosition) => {
      const poolId = `${position.base}-${position.quote}-${position.transactionHash}`;
      setPositionValues(prevBalances => {
        const updatedBalances = { ...prevBalances };
        if (updatedBalances[poolId]) {
          updatedBalances[poolId].value = newBalance;
        } else {
          updatedBalances[poolId] = {
            value: newBalance,
            poolId,
          };
        }

        return updatedBalances;
      });
    },
    [],
  );

  const totalBalance = useMemo(() => {
    const usdValue = Object.values(positionValues).reduce(
      (total, balance) => total.add(balance.value),
      Decimal.ZERO,
    );

    return usdValue.div(nativeTokenPrice);
  }, [nativeTokenPrice, positionValues]);

  const renderTotalBalance = useMemo(
    () =>
      account
        ? getConvertedValue(
            totalBalance,
            selectedCurrency,
            nativeTokenPrice,
            chainId,
          )
        : 0,
    [account, totalBalance, selectedCurrency, nativeTokenPrice, chainId],
  );

  useEffect(() => {
    if (totalBalance.gt(Decimal.ZERO) && account) {
      onValueChange(totalBalance, ProtocolTypes.MARKET_MAKING);
    }
  }, [onValueChange, account, totalBalance, nativeTokenPrice, block]);

  useEffect(() => {
    if (!account || totalBalance.isZero()) {
      onValueChange(Decimal.ZERO, ProtocolTypes.MARKET_MAKING);
    }
  }, [account, onValueChange, totalBalance, block]);

  return (
    <>
      {ammPools.map(pool => (
        <AmbientMarketMakingPositions
          key={`${pool.baseAddress}-${pool.quoteAddress}`}
          pool={pool}
          onBalanceChange={handleBalanceUpdate}
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
