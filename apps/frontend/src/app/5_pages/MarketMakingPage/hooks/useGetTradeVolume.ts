import { useMemo } from 'react';

import { rskClient } from '../../../../utils/clients';
import {
  GetTradeVolumeQuery,
  useGetTradeVolumeQuery,
} from '../../../../utils/graphql/rsk/generated';
import { get24HoursAgoInSeconds } from '../MarketMakingPage.utils';

export const useGetTradeVolume = (pool: string) => {
  const timestamp = get24HoursAgoInSeconds();

  const { loading, data, refetch } = useGetTradeVolumeQuery({
    client: rskClient,
    variables: {
      pool: pool,
      timestamp: timestamp,
    },
  });

  const poolVolume = useMemo(
    () => data?.poolVolumeItems[0].btcAmount as GetTradeVolumeQuery | undefined,
    [data],
  );

  return { loading, poolVolume, refetch };
};
