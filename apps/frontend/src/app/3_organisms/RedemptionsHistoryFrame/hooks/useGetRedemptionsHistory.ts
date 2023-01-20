import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { graphZeroUrl } from '../../../../utils/constants';
import { Redemption_OrderBy } from '../../../../utils/graphql/zero/generated';
import {
  GetRedemptionsDocument,
  Redemption_Filter,
} from './../../../../utils/graphql/zero/generated';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

export const useGetRedemptionsHistory = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const redemptionConfig = useMemo(
    () => ({
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as Redemption_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters: {
        redeemer: account,
      } as Redemption_Filter,
    }),
    [page, orderOptions, pageSize, account],
  );

  const { loading, data } = useQuery(GetRedemptionsDocument, {
    variables: redemptionConfig,
    client: zeroClient,
  });

  return { loading, data };
};
