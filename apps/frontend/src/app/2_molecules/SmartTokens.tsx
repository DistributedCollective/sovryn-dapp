import React, { useState } from 'react';

import { Table, OrderDirection, OrderOptions } from '@sovryn/ui';

import {
  SmartToken_OrderBy,
  useGetSmartTokensQuery,
} from '../../utils/graphql/rsk/generated';

// usage example, to be removed
export const SmartTokens = () => {
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: '',
    orderDirection: OrderDirection.Asc,
  });

  const { data } = useGetSmartTokensQuery({
    variables: {
      skip: 1,
      pageSize: 10,
      orderBy: (orderOptions.orderBy as SmartToken_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
    },
  });
  const tokens = data?.smartTokens || [];

  const columns = [
    {
      id: 'id',
      title: 'ID',
    },
    {
      id: 'name',
      title: 'Name',
    },
    {
      id: 'decimals',
      title: 'Decimals',
    },
  ];

  return (
    <Table
      setOrderOptions={setOrderOptions}
      orderOptions={orderOptions}
      columns={columns}
      rows={tokens}
    />
  );
};
