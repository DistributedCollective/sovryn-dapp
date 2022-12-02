import React, { useEffect, useState } from 'react';

import {
  Table,
  OrderDirection,
  OrderOptions,
  Pagination,
  Checkbox,
  Button,
  ButtonStyle,
} from '@sovryn/ui';

import {
  SmartToken_OrderBy,
  useGetSmartTokensQuery,
} from '../../utils/graphql/rsk/generated';

// usage example, to be removed
const pageSize = 5;
export const SmartTokens = () => {
  const [page, setPage] = useState(0);
  const [test, setTest] = useState(false);
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: '',
    orderDirection: OrderDirection.Asc,
  });

  const { data, loading } = useGetSmartTokensQuery({
    variables: {
      skip: page * pageSize,
      pageSize,
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
      filter: (
        <div>
          <Checkbox
            label="Increased collateral"
            checked={test}
            onChange={e => setTest(e.target.checked)}
          />
          <div className="w-full flex items-center justify-between mt-3">
            <Button style={ButtonStyle.secondary} text="Cancel" />
            <Button text="OK" />
          </div>
        </div>
      ),
    },
    {
      id: 'symbol',
      title: 'Symbol',
    },
    {
      id: 'decimals',
      title: 'Decimals',
    },
  ];

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);
  return (
    <div className="my-8">
      <Table
        setOrderOptions={setOrderOptions}
        orderOptions={orderOptions}
        columns={columns}
        rows={tokens}
        isLoading={loading}
      />
      <Pagination
        page={page}
        className="mt-6"
        onChange={(value: number) => {
          if (tokens.length < pageSize && value > page) {
            return;
          }
          setPage(value);
        }}
        itemsPerPage={pageSize}
      />
    </div>
  );
};
