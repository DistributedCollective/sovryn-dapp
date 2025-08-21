import React, { FC } from 'react';

import { numberToChainId } from '@sovryn/ethers-provider';
import { Pool } from '@sovryn/sdk';

import { AmountRenderer } from '../../../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import { useIsMounted } from '../../../../../../../../../hooks/useIsMounted';
import { useTokenDetailsByAsset } from '../../../../../../../../../hooks/useTokenDetailsByAsset';
import { decimalic } from '../../../../../../../../../utils/math';
import { AmbientPosition } from '../../../../AmbientMarketMaking.types';
import { useAmbientPositionBalance } from '../../hooks/useAmbientPositionBalance';

type AmbientPositionBalanceProps = {
  pool: Pool;
  position: AmbientPosition;
};

export const AmbientPositionBalance: FC<AmbientPositionBalanceProps> = ({
  position,
  pool,
}) => {
  const isMounted = useIsMounted();
  const baseToken = useTokenDetailsByAsset(
    pool.base.symbol,
    numberToChainId(pool.chainId),
  );
  const quoteToken = useTokenDetailsByAsset(
    pool.quote.symbol,
    numberToChainId(pool.chainId),
  );
  const result = useAmbientPositionBalance(pool, position);
  if (!result || !isMounted()) {
    return null;
  }

  return (
    <div className="inline-flex flex-col">
      <AmountRenderer
        value={decimalic(result?.positionLiqBase || '0').toUnits(
          baseToken?.decimals,
        )}
        suffix={pool.base.symbol}
      />
      <AmountRenderer
        value={decimalic(result?.positionLiqQuote || '0').toUnits(
          quoteToken?.decimals,
        )}
        suffix={pool.quote.symbol}
      />
    </div>
  );
};
