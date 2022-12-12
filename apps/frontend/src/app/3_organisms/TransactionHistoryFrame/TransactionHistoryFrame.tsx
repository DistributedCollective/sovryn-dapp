import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
  TransactionId,
} from '@sovryn/ui';

import { TableFilter } from '../../2_molecules/TableFilter/TableFilter';
import { Filter } from '../../2_molecules/TableFilter/TableFilter.types';
import { chains, defaultChainId } from '../../../config/chains';
import { translations } from '../../../locales/i18n';
import { graphZeroUrl } from '../../../utils/constants';
import {
  GetTroveDocument,
  InputMaybe,
  TroveChange,
  TroveChange_Filter,
  TroveChange_OrderBy,
  TroveOperation,
} from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';

const zeroClient = new ApolloClient({
  uri: graphZeroUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

// TODO usage example, to be removed
const pageSize = 10;
const liquidationReserveAmount = 20;

export const TransactionHistoryFrame: FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const chain = chains.find(chain => chain.id === defaultChainId);
  const [filters, setFilters] = useState<
    InputMaybe<TroveChange_Filter> | undefined
  >();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { loading, data } = useQuery(GetTroveDocument, {
    variables: {
      //TODO: switch to the user's address
      //hardcoded address for testing
      user: '0x008fa28d27e7164eff3d92d7d577854b79f4396f',
      skip: page * pageSize,
      pageSize,
      orderBy: (orderOptions.orderBy as TroveChange_OrderBy) || undefined,
      orderDirection: orderOptions.orderDirection || undefined,
      filters,
    },
    client: zeroClient,
  });

  const noDataLabel = useMemo(
    () =>
      Object.keys(filters || {}).length > 0
        ? t(translations.transactionHistory.table.noDataWithFilters)
        : t(translations.transactionHistory.table.noData),
    [t, filters],
  );

  const getTroveType = useCallback(
    (trove: TroveOperation) => {
      switch (trove) {
        case TroveOperation.OpenTrove:
          return t(translations.transactionHistory.troveTypes.open);
        case TroveOperation.CloseTrove:
          return t(translations.transactionHistory.troveTypes.close);
        case TroveOperation.AdjustTrove:
          return t(translations.transactionHistory.troveTypes.adjust);
        case TroveOperation.RedeemCollateral:
          return t(translations.transactionHistory.troveTypes.redemption);
        case TroveOperation.LiquidateInNormalMode:
          return t(translations.transactionHistory.troveTypes.liquidation);
        case TroveOperation.LiquidateInRecoveryMode:
          return t(translations.transactionHistory.troveTypes.withdraw);
        case TroveOperation.AccrueRewards:
          return t(translations.transactionHistory.troveTypes.accrueRewards);
        default:
          return '';
      }
    },
    [t],
  );

  const troves = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.trove?.changes;
  }, [data]);

  const getLiquidationReserve = useCallback((trove: TroveChange) => {
    const { troveOperation, redemption } = trove;
    if (troveOperation === TroveOperation.OpenTrove) {
      return (
        <>
          +{liquidationReserveAmount} {SupportedTokens.zusd}
        </>
      );
    }

    if (
      troveOperation.includes(
        TroveOperation.CloseTrove || TroveOperation.LiquidateInNormalMode,
      ) ||
      (troveOperation === TroveOperation.RedeemCollateral &&
        redemption?.partial === true)
    ) {
      return (
        <>
          -{liquidationReserveAmount} {SupportedTokens.zusd}
        </>
      );
    }

    return '—';
  }, []);

  const transactionTypeFilters = useMemo(() => {
    return Object.keys(TroveOperation).map(key => ({
      label: getTroveType(TroveOperation[key]),
      filter: 'troveOperation_in',
      value: TroveOperation[key],
      checked:
        (filters &&
          filters['troveOperation_in']?.includes(TroveOperation[key])) ||
        false,
    }));
  }, [filters, getTroveType]);

  const collateralChangeFilters = useMemo(
    () => [
      {
        label: t(translations.transactionHistory.filters.increasedCollateral),
        filter: 'collateralChange_gte',
        value: 0,
        checked: Object.hasOwn(filters || {}, 'collateralChange_gte'),
      },
      {
        label: t(translations.transactionHistory.filters.decreasedCollateral),
        filter: 'collateralChange_lte',
        value: 0,
        checked: Object.hasOwn(filters || {}, 'collateralChange_lte'),
      },
    ],
    [t, filters],
  );

  const debtChangeFilters = useMemo(
    () => [
      {
        label: t(translations.transactionHistory.filters.increasedDebt),
        filter: 'debtChange_gte',
        value: 0,
        checked: Object.hasOwn(filters || {}, 'debtChange_gte'),
      },
      {
        label: t(translations.transactionHistory.filters.decreasedDebt),
        filter: 'debtChange_lte',
        value: 0,
        checked: Object.hasOwn(filters || {}, 'debtChange_lte'),
      },
    ],
    [t, filters],
  );

  const updateFilters = useCallback((filterList: Filter[]) => {
    setFilters({
      ...filterList
        .filter(f => !!f.checked)
        .reduce(
          (accum, curr) => ({
            ...accum,
            [curr.filter]:
              curr.filter === 'troveOperation_in'
                ? [...(accum[curr.filter] || []), curr.value]
                : curr.value,
          }),
          {},
        ),
    } as InputMaybe<TroveChange_Filter>);
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.transactionHistory.table.timestamp),
        cellRenderer: (item: TroveChange) =>
          dateFormat(item.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'transactionType',
        title: t(translations.transactionHistory.table.transactionType),
        cellRenderer: (item: TroveChange) =>
          `${getTroveType(item.troveOperation)}`,
        filter: (
          <TableFilter
            filterList={transactionTypeFilters}
            onChange={updateFilters}
          />
        ),
      },
      {
        id: 'collateralChange',
        title: t(translations.transactionHistory.table.collateralChange),
        cellRenderer: (item: TroveChange) => (
          <div className="uppercase">
            {item.collateralChange.length ? (
              <>
                {item.collateralChange} {SupportedTokens.rbtc}
              </>
            ) : (
              '—'
            )}
          </div>
        ),
        filter: (
          <TableFilter
            filterList={collateralChangeFilters}
            onChange={updateFilters}
          />
        ),
      },
      {
        id: 'newCollateralBalance',
        title: t(translations.transactionHistory.table.newCollateralBalance),
        cellRenderer: (item: TroveChange) => (
          <div className="uppercase">
            {item.collateralAfter.length ? (
              <>
                {item.redemption?.partial === true ? 0 : item.collateralAfter}{' '}
                {SupportedTokens.rbtc}
              </>
            ) : (
              '—'
            )}
          </div>
        ),
      },
      {
        id: 'debtChange',
        title: t(translations.transactionHistory.table.debtChange),
        cellRenderer: (item: TroveChange) => (
          <div className="uppercase">
            {item.debtChange.length ? (
              <>
                {item.debtChange} {SupportedTokens.zusd}
              </>
            ) : (
              '—'
            )}
          </div>
        ),
        filter: (
          <TableFilter
            filterList={debtChangeFilters}
            onChange={updateFilters}
          />
        ),
      },
      {
        id: 'liquidationReserve',
        title: t(translations.transactionHistory.table.liquidationReserve),
        cellRenderer: (item: TroveChange) => (
          <div className="uppercase">{getLiquidationReserve(item)}</div>
        ),
      },
      {
        id: 'newDebt',
        title: t(translations.transactionHistory.table.newDebt),
        cellRenderer: (item: TroveChange) => (
          <div className="uppercase">
            {item.debtAfter.length ? (
              <>
                {item.redemption?.partial === true ? 0 : item.debtAfter}{' '}
                {SupportedTokens.zusd}
              </>
            ) : (
              '—'
            )}
          </div>
        ),
      },
      {
        id: 'originationFee',
        title: t(translations.transactionHistory.table.originationFee),
        cellRenderer: (item: TroveChange) => (
          <div className="uppercase">
            {item.borrowingFee ? (
              <>
                {item.borrowingFee} {SupportedTokens.zusd}
              </>
            ) : (
              '—'
            )}
          </div>
        ),
      },
      {
        id: 'transactionID',
        title: t(translations.transactionHistory.table.transactionID),
        cellRenderer: (item: TroveChange) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
            value={item.transaction.id}
            dataLayoutId="history-address-id"
          />
        ),
      },
    ],
    [
      t,
      chain,
      getTroveType,
      transactionTypeFilters,
      updateFilters,
      getLiquidationReserve,
      collateralChangeFilters,
      debtChangeFilters,
    ],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (troves?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, troves?.length],
  );

  useEffect(() => {
    setPage(0);
  }, [orderOptions, filters]);

  return (
    <div className="bg-gray-80 py-4 px-6 rounded">
      <Table
        setOrderOptions={setOrderOptions}
        orderOptions={orderOptions}
        columns={columns}
        rows={troves}
        rowTitle={row => (
          <Paragraph size={ParagraphSize.small}>
            {getTroveType(row.troveOperation)} -{' '}
            {dateFormat(row.transaction.timestamp)}
          </Paragraph>
        )}
        isLoading={loading}
        className="bg-gray-80 text-gray-10 md:px-6 md:py-4"
        noData={noDataLabel}
        dataAttribute="transaction-history-table"
      />
      <Pagination
        page={page}
        hideFirstPageButton
        className="md:pb-6 mt-3 md:mt-6 justify-center md:justify-start"
        onChange={onPageChange}
        itemsPerPage={pageSize}
        dataAttribute="transaction-history-pagination"
      />
    </div>
  );
};
