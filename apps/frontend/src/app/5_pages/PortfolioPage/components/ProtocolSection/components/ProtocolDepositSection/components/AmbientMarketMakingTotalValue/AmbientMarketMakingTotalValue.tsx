import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Decimal } from '@sovryn/utils';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useAccount } from '../../../../../../../../../hooks/useAccount';
import { useCurrentChain } from '../../../../../../../../../hooks/useChainStore';
import { findAssetByAddress } from '../../../../../../../../../utils/asset';
import { AmbientPosition } from '../../../../../../../MarketMakingPage/components/AmbientMarketMaking/AmbientMarketMaking.types';
import { useAmbientPositions } from '../../../../../../../MarketMakingPage/components/AmbientMarketMaking/hooks/useAmbientPositions';
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
import { PositionBalance } from './components/PositionBalance';

export const AmbientMarketMakingTotalValue: FC<ProtocolSectionProps> = ({
  selectedCurrency,
  nativeTokenPrice,
  onValueChange,
}) => {
  const { positions } = useAmbientPositions();
  const { account } = useAccount();
  const [positionValues, setPositionValues] = useState<PositionValues>({});

  const chainId = useCurrentChain();

  const handleBalanceUpdate = useCallback(
    (newBalance: Decimal, position: AmbientPosition) => {
      setPositionValues(prevBalances => {
        return {
          ...prevBalances,
          [position.positionId]: {
            value: newBalance,
            poolId: `${position.base}-${position.quote}`,
          },
        };
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
  }, [onValueChange, account, totalBalance, nativeTokenPrice]);

  useEffect(() => {
    if (!account || totalBalance.isZero()) {
      onValueChange(Decimal.ZERO, ProtocolTypes.MARKET_MAKING);
    }
  }, [account, onValueChange, totalBalance]);

  console.log({
    totalBalance: totalBalance.toString(),
    positionValues,
  });
  return (
    <>
      {positions.map((position, index) => {
        const assetA = findAssetByAddress(position.base, chainId);
        const assetB = findAssetByAddress(position.quote, chainId);

        const pool = AmbientLiquidityPoolDictionary.get(
          assetA?.symbol,
          assetB?.symbol,
          chainId,
        );
        if (!pool) {
          return null;
        }
        return (
          <PositionBalance
            key={index}
            position={position}
            pool={pool}
            onBalanceChange={newBalance =>
              handleBalanceUpdate(newBalance, position)
            }
          />
        );
      })}
      <AmountRenderer
        value={renderTotalBalance}
        suffix={selectedCurrency}
        precision={getCurrencyPrecision(selectedCurrency)}
        isAnimated
      />
    </>
  );
};
