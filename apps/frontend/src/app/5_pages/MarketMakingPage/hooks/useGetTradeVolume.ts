import { useMemo } from 'react';

import dayjs from 'dayjs';

import { SECONDS_IN_DAY } from '../../../../constants/general';
import { rskClient } from '../../../../utils/clients';
import { useGetTradeVolumeQuery } from '../../../../utils/graphql/rsk/generated';

export const useGetTradeVolume = (pool: string) => {
  const timestamp = useMemo(
    () => dayjs().subtract(SECONDS_IN_DAY, 'seconds').unix(),
    [],
  );
  const { loading, data, error, refetch } = useGetTradeVolumeQuery({
    client: rskClient,
    variables: {
      pool: pool,
      timestamp: timestamp,
    },
  });

  if (error) {
    console.error('Error fetching trade volume:', error);
  }

  const poolVolume = useMemo(() => {
    const poolVolumeItems = data?.poolVolumeItems ?? [];
    return poolVolumeItems.reduce(
      (sum, item) => sum + (+item.btcAmount || 0),
      0,
    );
  }, [data]);

  return { loading, poolVolume, refetch };
};
