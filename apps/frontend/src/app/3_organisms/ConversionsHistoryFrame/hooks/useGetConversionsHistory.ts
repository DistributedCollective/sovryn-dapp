import { useQuery } from '@apollo/client';

import { useMemo } from 'react';

import { OrderOptions } from '@sovryn/ui';

import { myntClient } from '../../../../utils/clients';
import {
  Conversion_OrderBy,
  GetUserConversionsDocument,
} from '../../../../utils/graphql/mynt/generated';

export const useGetConversionsHistory = (
  account: string,
  pageSize: number,
  page: number,
  orderOptions: OrderOptions,
) => {
  const config = useMemo(
    () => ({
      user: account,
      skip: page * pageSize,
      pageSize,
      orderBy: orderOptions.orderBy as Conversion_OrderBy,
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

  return useQuery(GetUserConversionsDocument, {
    variables: config,
    client: myntClient,
  });
};
