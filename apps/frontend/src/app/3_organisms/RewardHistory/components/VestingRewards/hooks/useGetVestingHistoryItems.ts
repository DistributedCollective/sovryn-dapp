import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { rskClient } from '../../../../../../utils/clients';
import {
  VestingHistoryItem,
  VestingHistoryItem_OrderBy,
  useGetVestingHistoryItemsQuery,
} from '../../../../../../utils/graphql/rsk/generated';

export const useGetVestingHistoryItems = (
  stakers: string[],
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      stakers: stakers,
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as VestingHistoryItem_OrderBy,
      orderDirection: orderOptions.orderDirection,
    }),
    [page, orderOptions, pageSize, stakers],
  );

  const { loading, data } = useGetVestingHistoryItemsQuery({
    variables: config,
    client: rskClient,
  });

  const list = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.vestingHistoryItems;
  }, [data]);

  return { loading, data: list as VestingHistoryItem[] };
};
