import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../utils/clients';
import {
  useGetV2DelegateChangesQuery,
  V2DelegateChanged_OrderBy,
} from '../../../../../utils/graphql/rsk/generated';
import { V2StakingDelegateChangeItem } from '../StakingDelegateChanges.types';

export const useGetStakingDelegateChanges = (
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
      orderBy: orderOptions.orderBy as V2DelegateChanged_OrderBy,
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

  const { loading, data } = useGetV2DelegateChangesQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.v2DelegateChangeds;
  }, [data]);

  return { loading, data: list as V2StakingDelegateChangeItem[] };
};
