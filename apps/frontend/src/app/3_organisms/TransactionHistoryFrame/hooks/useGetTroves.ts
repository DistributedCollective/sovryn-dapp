import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { graphZeroUrl } from '../../../../utils/constants';
import {
  GetTroveDocument,
  InputMaybe,
  TroveChange_Filter,
  TroveChange_OrderBy,
} from '../../../../utils/graphql/zero/generated';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

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
