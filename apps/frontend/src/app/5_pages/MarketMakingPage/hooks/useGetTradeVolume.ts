import { useMemo } from 'react';

import { SECONDS_IN_DAY } from '../../../../constants/general';
import { rskClient } from '../../../../utils/clients';
import {
  GetTradeVolumeQuery,
  useGetTradeVolumeQuery,
} from '../../../../utils/graphql/rsk/generated';

export const useGetTradeVolume = (pool: string) => {
  const { loading, data, refetch } = useGetTradeVolumeQuery({
    client: rskClient,
    variables: {
      pool: pool,
      timestamp: SECONDS_IN_DAY,
    },
  });

  const poolVolume = useMemo(
    () => data?.poolVolumeItems[0].btcAmount as GetTradeVolumeQuery | undefined,
    [data],
  );

  return { loading, poolVolume, refetch };
};
