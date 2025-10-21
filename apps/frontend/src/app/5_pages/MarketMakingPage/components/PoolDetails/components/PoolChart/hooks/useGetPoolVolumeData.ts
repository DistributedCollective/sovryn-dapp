import { useCallback, useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { getServicesConfig } from '../../../../../../../../utils/helpers';
import { AmmLiquidityPool } from '../../../../../utils/AmmLiquidityPool';

const servicesConfig = getServicesConfig();

export type PoolVolumeData = {
  timestamp: string;
  apy: number;
  btcVolume: string;
};

export const useGetPoolVolumeData = (pool: AmmLiquidityPool) => {
  const [data, setData] = useState<PoolVolumeData[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  const getData = useCallback(async () => {
    const response = await fetch(
      `${servicesConfig.amm}amm/volume/pool/${pool.converter.toLowerCase()}`,
    );

    if (response.ok) {
      const result = await response.json();

      const data: PoolVolumeData[] = result[pool.converter.toLowerCase()].data[
        pool.poolTokenA.toLowerCase()
      ].map(item => ({
        timestamp: dayjs(item.activity_date).format('YYYY-MM-DD'),
        apy: Number(item.APY_fees_pc),
        btcVolume: String(item.btc_volume),
      }));

      setData(data);
      setIsFetched(true);
    }
  }, [pool.converter, pool.poolTokenA]);

  useEffect(() => {
    if (!isFetched) {
      getData();
    }
  }, [getData, isFetched]);

  return data;
};
