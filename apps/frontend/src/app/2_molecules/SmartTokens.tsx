import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Table, OrderOptions, Pagination, OrderDirection } from '@sovryn/ui';

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

  const updateFilters = useCallback((filterList: FilterType[]) => {
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
  }, []);

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

  const columns = useMemo(
    () => [
      {
        id: 'addedToRegistryBlockNumber',
        title: 'Block Number',
        sample: '6666666',
        sortable: true,
      },
      {
        id: 'name',
        title: 'Name',
        sortable: true,
        sample: 'BProRBTC Liquidity Pool',
      },
      {
        id: 'symbol',
        title: 'Symbol',
        sample: 'BProRBTC',
      },
      {
        id: 'decimals',
        title: 'Decimals',
        filter: (
          <TableFilter filterList={decimalFilters} onChange={updateFilters} />
        ),
        sample: '18',
      },
    ],
    [decimalFilters, updateFilters],
  );

  useEffect(() => {
    setPage(0);
  }, [orderOptions, filters]);

  const onPageChange = useCallback(
    (value: number) => {
      if (tokens.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, tokens.length],
  );

  return (
    <div className="my-8 bg-gray-80 md:bg-transparent">
      <Table
        setOrderOptions={setOrderOptions}
        orderOptions={orderOptions}
        columns={columns}
        rows={tokens}
        isLoading={loading}
        rowTitle={row => <>{row.name}</>}
      />
      <Pagination
        page={page}
        hideFirstPageButton
        className="pb-6 mt-3 md:pb-0 md:mt-6 justify-center md:justify-start"
        onChange={onPageChange}
        itemsPerPage={pageSize}
      />
    </div>
  );
};
