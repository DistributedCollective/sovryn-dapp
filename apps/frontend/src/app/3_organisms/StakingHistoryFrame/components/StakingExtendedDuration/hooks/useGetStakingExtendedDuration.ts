import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../../utils/clients';
import {
  useGetV2ExtendedStakingDurationsQuery,
  V2ExtendedStakingDuration_OrderBy,
} from '../../../../../../utils/graphql/rsk/generated';
import { V2StakingExtendedDurationItem } from '../StakingExtendedDuration.types';

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

  const { loading, data } = useGetV2ExtendedStakingDurationsQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.v2ExtendedStakingDurations;
  }, [data]);

  return { loading, data: list as V2StakingExtendedDurationItem[] };
};
