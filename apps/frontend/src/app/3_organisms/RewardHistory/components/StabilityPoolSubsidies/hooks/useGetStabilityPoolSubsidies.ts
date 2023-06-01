import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../../../utils/clients';
import {
  SovDistribution,
  SovDistribution_OrderBy,
  useGetSubsidyQuery,
} from '../../../../../../utils/graphql/zero/generated';

export const useGetStabilityPoolSubsidies = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      user: account.toLowerCase(),
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as SovDistribution_OrderBy,
      orderDirection: orderOptions.orderDirection,
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data } = useGetSubsidyQuery({
    variables: config,
    client: zeroClient,
  });

  const sovdistributions = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.sovdistributions;
  }, [data]);

  return { loading, data: sovdistributions as SovDistribution[] };
};
