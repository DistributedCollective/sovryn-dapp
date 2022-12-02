import React, { useEffect, useMemo, useState } from 'react';

import { Table, OrderDirection, OrderOptions, Pagination } from '@sovryn/ui';

import {
  InputMaybe,
  SmartToken_Filter,
  SmartToken_OrderBy,
  useGetSmartTokensQuery,
} from '../../utils/graphql/rsk/generated';
import { TableFilter } from './TableFilter/TableFilter';
import { FilterType } from './TableFilter/TableFilter.types';

// usage example, to be removed
const pageSize = 5;
export const SmartTokens = () => {
  const [filters, setFilters] = useState<
    InputMaybe<SmartToken_Filter> | undefined
  >();
  const [page, setPage] = useState(0);
  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'name',
    orderDirection: OrderDirection.Asc,
  });

  const { data, loading } = useGetSmartTokensQuery({
    variables: {
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as SmartToken_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters,
    },
  });
  const tokens = data?.smartTokens || [];

  const updateFilters = (filterList: FilterType[]) => {
    setFilters({
      ...filterList
        .filter(f => !!f.checked)
        .reduce(
          (accum, curr) => ({
            ...accum,
            [curr.filter]: curr.value,
          }),
          {},
        ),
    } as InputMaybe<SmartToken_Filter>);
  };

  const decimalFilters = useMemo(
    () => [
      {
        label: 'Decimals less than 18',
        filter: 'decimals_lt',
        value: 10,
        checked: Object.hasOwn(filters || {}, 'decimals_lt'),
      },
    ],
    [filters],
  );

  const columns = [
    {
      id: 'id',
      title: 'ID',
    },
    {
      id: 'name',
      title: 'Name',
      sortable: true,
    },
    {
      id: 'symbol',
      title: 'Symbol',
      sortable: true,
    },
    {
      id: 'decimals',
      title: 'Decimals',
      filter: (
        <TableFilter filterList={decimalFilters} onChange={updateFilters} />
      ),
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
