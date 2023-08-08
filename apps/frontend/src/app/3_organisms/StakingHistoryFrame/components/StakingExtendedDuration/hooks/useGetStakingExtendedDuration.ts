import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../../utils/clients';
import {
  useGetExtendedStakingDurationsQuery,
  V2ExtendedStakingDuration_OrderBy,
} from '../../../../../../utils/graphql/rsk/generated';
import { StakingExtendedDurationItem } from '../StakingExtendedDuration.types';

export const useGetStakingExtendedDuration = (
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
      orderBy: orderOptions.orderBy as V2ExtendedStakingDuration_OrderBy,
      orderDirection: orderOptions.orderDirection,
    }),
    [
      account,
      orderOptions.orderBy,
      orderOptions.orderDirection,
      page,
      pageSize,
    ],
  );

  const { loading, data } = useGetExtendedStakingDurationsQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.v2ExtendedStakingDurations;
  }, [data]);

  return { loading, data: list as StakingExtendedDurationItem[] };
};
