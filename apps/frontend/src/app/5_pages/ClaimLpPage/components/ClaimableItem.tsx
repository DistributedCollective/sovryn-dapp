import React, { FC, useEffect, useState } from 'react';

import { CrocEnv } from '@sovryn/sdex';
import { Pool } from '@sovryn/sdk';
import { Decimal } from '@sovryn/utils';

import { BOB_CHAIN_ID } from '../../../../config/chains';

import { AmountRenderer } from '../../../2_molecules/AmountRenderer/AmountRenderer';
import { AssetPairRenderer } from '../../../2_molecules/AssetPairRenderer/AssetPairRenderer';
import { loadIndexer } from '../../../../lib/indexer';
import { decimalic } from '../../../../utils/math';
import { Claim } from '../hooks/useClaimLp';

type ClaimableItemProps = {
  item: Claim;
};

export const ClaimableItem: FC<ClaimableItemProps> = ({ item }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pool, setPool] = useState<Pool | null>(null);
  const [liqBase, setLiqBase] = useState<Decimal>(Decimal.ZERO);
  const [liqQuote, setLiqQuote] = useState<Decimal>(Decimal.ZERO);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const env = new CrocEnv(BOB_CHAIN_ID);
        const pools = await loadIndexer(BOB_CHAIN_ID).pools.list();
        const amm = pools.find(
          p => p.extra.lpToken?.toLowerCase() === item.token.toLowerCase(),
        );
        setPool(amm!);
        if (!amm) {
          return;
        }
        const p = env.pool(
          amm.base.address,
          amm.quote.address,
          amm.extra.poolIdx,
        );

        const [spotPrice, baseDecimals, quoteDecimals] = await Promise.all([
          p.spotPrice(),
          p.baseToken.decimals,
          p.quoteToken.decimals,
        ]);

        setLiqBase(
          decimalic(
            (Number(item.amount) * Math.sqrt(spotPrice)).toFixed(0),
          ).toUnits(baseDecimals),
        );
        setLiqQuote(
          decimalic(
            (Number(item.amount) / Math.sqrt(spotPrice)).toFixed(0),
          ).toUnits(quoteDecimals),
        );
      } catch (e) {
        setLiqBase(Decimal.ZERO);
        setLiqQuote(Decimal.ZERO);
      } finally {
        setLoading(false);
      }
    })();
  }, [item]);

  if (loading || !pool) {
    return null;
  }

  return (
    <div className="first:mt-4 mb-2 px-4 py-2 bg-gray-70 flex flex-row space-x-4 items-center justify-between text-xs rounded">
      <div className="basis-1/3">
        <AssetPairRenderer
          asset1={pool.quote.symbol}
          asset2={pool.base.symbol}
          chainId={BOB_CHAIN_ID}
        />
      </div>
      <div className="basis-1/3">
        <AmountRenderer value={liqBase} suffix={pool.base.symbol} />
      </div>
      <div className="basis-1/3">
        <AmountRenderer value={liqQuote} suffix={pool.quote.symbol} />
      </div>
    </div>
  );
};
