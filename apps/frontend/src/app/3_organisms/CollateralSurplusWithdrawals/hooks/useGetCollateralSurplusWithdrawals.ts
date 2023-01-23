import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { graphZeroUrl } from '../../../../utils/constants';
import {
  CollSurplusChange_Filter,
  CollSurplusChange_OrderBy,
  GetCollSurplusChangesDocument,
} from './../../../../utils/graphql/zero/generated';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetCollateralSurplusWithdrawals = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as CollSurplusChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters: {
        user_contains: account || '',
        collSurplusAfter: '0',
      } as CollSurplusChange_Filter,
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data } = useQuery(GetCollSurplusChangesDocument, {
    variables: config,
    client: zeroClient,
  });

  return { loading, data };
};
