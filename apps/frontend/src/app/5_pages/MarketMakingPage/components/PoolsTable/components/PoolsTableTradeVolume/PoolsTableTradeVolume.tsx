import React, { FC, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { AmountRenderer } from '../../../../../../2_molecules/AmountRenderer/AmountRenderer';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
} from '../../../../../../../constants/currencies';
import { useBlockNumber } from '../../../../../../../hooks/useBlockNumber';
import { translations } from '../../../../../../../locales/i18n';
import { useGetTradeVolume } from '../../../../hooks/useGetTradeVolume';
import { AmmLiquidityPool } from '../../../../utils/AmmLiquidityPool';

type PoolsTableTradeVolumeProps = {
  pool: AmmLiquidityPool;
};

export const PoolsTableTradeVolume: FC<PoolsTableTradeVolumeProps> = ({
  pool,
}) => {
  const { poolVolume, loading, refetch } = useGetTradeVolume(pool.converter);
  const { value: block } = useBlockNumber();

  const renderPoolVolume = useMemo(
    () => (
      <>
        {!loading && poolVolume ? (
          <AmountRenderer
            value={poolVolume.toString()}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="market-making-trade-volume"
          />
        ) : (
          t(translations.common.na)
        )}
      </>
    ),
    [poolVolume, loading],
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  return <>{renderPoolVolume}</>;
};
