import { useMemo } from 'react';

import { rskClient } from '../../../../../../utils/clients';
import { useGetConversionFeeQuery } from '../../../../../../utils/graphql/rsk/generated';

export const useGetConversionFee = (poolToken: string) => {
  const { loading, data, refetch } = useGetConversionFeeQuery({
    client: rskClient,
    variables: {
      smartToken: poolToken,
    },
  });

  const conversionFee = useMemo(() => {
    const conversionFeeAmount = data?.liquidityPools[0]?.conversionFee ?? 0;
    const maxConversionFeeAmount =
      data?.liquidityPools[0]?.maxConversionFee ?? 0;

    if (
      !conversionFeeAmount ||
      !maxConversionFeeAmount ||
      maxConversionFeeAmount === '0'
    ) {
      return 0;
    }

    return (Number(conversionFeeAmount) * 100) / Number(maxConversionFeeAmount);
  }, [data]);

  return { loading, conversionFee, refetch };
};
