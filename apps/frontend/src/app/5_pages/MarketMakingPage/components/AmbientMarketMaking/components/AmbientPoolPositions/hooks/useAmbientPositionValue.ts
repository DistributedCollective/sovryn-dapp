import { useMemo } from 'react';

import { numberToChainId } from '@sovryn/ethers-provider';
import { Pool } from '@sovryn/sdk';

import { useCurrentChain } from '../../../../../../../../hooks/useChainStore';
import { useDollarValue } from '../../../../../../../../hooks/useDollarValue';
import { useTokenDetailsByAsset } from '../../../../../../../../hooks/useTokenDetailsByAsset';
import { decimalic, toWei } from '../../../../../../../../utils/math';
import { AmbientPosition } from '../../../AmbientMarketMaking.types';
import { useAmbientPositionBalance } from './useAmbientPositionBalance';

export const useAmbientPositionValue = (
  pool: Pool,
  position: AmbientPosition,
) => {
  const chainId = useCurrentChain();
  const result = useAmbientPositionBalance(pool, position);
  const baseToken = useTokenDetailsByAsset(
    pool.base.symbol,
    numberToChainId(pool.chainId),
  );
  const quoteToken = useTokenDetailsByAsset(
    pool.quote.symbol,
    numberToChainId(pool.chainId),
  );

  const { usdPrice: baseUsdPrice } = useDollarValue(
    pool.base.symbol,
    toWei(1).toString(),
    chainId,
  );
  const { usdPrice: quoteUsdPrice } = useDollarValue(
    pool.quote.symbol,
    toWei(1).toString(),
    chainId,
  );

  const value = useMemo(() => {
    const baseValue = decimalic(result?.positionLiqBase || '0')
      .toUnits(baseToken?.decimals)
      .mul(baseUsdPrice);

    const quoteValue = decimalic(result?.positionLiqQuote || '0')
      .toUnits(quoteToken?.decimals)
      .mul(quoteUsdPrice);

    return result
      ? decimalic(baseValue || 0)
          .add(quoteValue || 0)
          .toNumber()
      : null;
  }, [
    baseToken?.decimals,
    baseUsdPrice,
    quoteToken?.decimals,
    quoteUsdPrice,
    result,
  ]);

  return value;
};
