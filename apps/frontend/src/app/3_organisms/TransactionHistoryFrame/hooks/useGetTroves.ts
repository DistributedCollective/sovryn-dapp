import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { zeroClient } from '../../../../utils/clients';
import {
  GetTroveDocument,
  InputMaybe,
  TroveChange_Filter,
  TroveChange_OrderBy,
} from '../../../../utils/graphql/zero/generated';

export const useGetTroves = (
  account: string,
  pageSize: number,
  page: number,
  filters: InputMaybe<TroveChange_Filter> | undefined,
  orderOptions: OrderOptions,
) => {
  const troveConfig = useMemo(
    () => ({
      user: account,
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as TroveChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters,
    }),
    [account, page, orderOptions, filters, pageSize],
  );

  const { loading, data } = useQuery(GetTroveDocument, {
    variables: troveConfig,
    client: zeroClient,
  });

  return { loading, data };
};
