import { useMemo } from 'react';

import { rskClient } from '../../../../../../utils/clients';
import { useGetProtocolFeeQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetProtocolFee = () => {
  const { loading, data, refetch } = useGetProtocolFeeQuery({
    client: rskClient,
  });

  const protocolFee = useMemo(() => {
    const protocolFee = data?.swapSettings[0].protocolFee ?? 0;
    return protocolFee / 1e4;
  }, [data]);

  return { loading, protocolFee, refetch };
};
