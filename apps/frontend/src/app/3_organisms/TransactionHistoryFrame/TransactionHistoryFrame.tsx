import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import { SupportedTokens } from '@sovryn/contracts';
import {
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
  Tooltip,
  TooltipTrigger,
  TransactionId,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { TableFilter } from '../../2_molecules/TableFilter/TableFilter';
import { Filter } from '../../2_molecules/TableFilter/TableFilter.types';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { useBlockNumber } from '../../../hooks/useBlockNumber';
import { translations } from '../../../locales/i18n';
import { zeroClient } from '../../../utils/clients';
import {
  Bitcoin,
  LIQUIDATION_RESERVE_AMOUNT,
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../utils/constants';
import {
  InputMaybe,
  TroveChange,
  TroveChange_Filter,
  TroveChange_OrderBy,
  TroveOperation,
  useGetTroveLazyQuery,
} from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { formatValue } from '../../../utils/math';
import { useGetTroves } from './hooks/useGetTroves';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const TransactionHistoryFrame: FC = () => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const [page, setPage] = useState(0);
  const chain = chains.find(chain => chain.id === defaultChainId);
  const [filters, setFilters] = useState<InputMaybe<TroveChange_Filter>>({});

  const { value: block } = useBlockNumber();

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const getTroveType = useCallback((trove: TroveOperation) => {
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
        return t(
          translations.transactionHistory.troveTypes.liquidationRecovery,
        );
      case TroveOperation.AccrueRewards:
        return t(translations.transactionHistory.troveTypes.accrueRewards);
      default:
        return '';
    }
  }, []);

  const transactionTypeFilters = useMemo(() => {
    return Object.keys(TroveOperation).map(key => ({
      label: getTroveType(TroveOperation[key]),
      filter: 'troveOperation_in',
      value: TroveOperation[key],
      checked:
        filters && filters['troveOperation_in']?.includes(TroveOperation[key])
          ? true
          : false,
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
    [filters],
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
    [filters],
  );

  /**
   * @description
   * This function is used to remove the filters that are not needed in the query,
   * if they are all checked inside of the filter group.
   * For example, if all the filters in collateralChangeFilters are checked,
   * then we don't need to send the collateralChange_gte and collateralChange_lte filters to the query.
   */
  const getFinalFilters = useCallback(() => {
    const newFilters = { ...filters };
    if (collateralChangeFilters.every(filter => filter.checked)) {
      collateralChangeFilters.forEach(item => delete newFilters[item.filter]);
    }
    if (debtChangeFilters.every(filter => filter.checked)) {
      debtChangeFilters.forEach(item => delete newFilters[item.filter]);
    }
    if (transactionTypeFilters.every(filter => filter.checked)) {
      transactionTypeFilters.forEach(item => delete newFilters[item.filter]);
    }
    return newFilters;
  }, [
    filters,
    collateralChangeFilters,
    debtChangeFilters,
    transactionTypeFilters,
  ]);

  const { data, loading, refetch } = useGetTroves(
    account,
    pageSize,
    page,
    getFinalFilters(),
    orderOptions,
  );

  useEffect(() => {
    refetch();
  }, [refetch, block]);

  const [getTroves] = useGetTroveLazyQuery({
    client: zeroClient,
  });

  const noDataLabel = useMemo(
    () =>
      Object.keys(filters || {}).length > 0
        ? t(translations.common.tables.noDataWithFilters)
        : t(translations.common.tables.noData),
    [filters],
  );

  const troves = useMemo(
    () => (data?.trove?.changes as TroveChange[]) || [],
    [data?.trove?.changes],
  );

  const renderLiquidationReserve = useCallback(trove => {
    const { troveOperation, redemption } = trove;
    const operations = [
      TroveOperation.LiquidateInNormalMode,
      TroveOperation.LiquidateInRecoveryMode,
      TroveOperation.CloseTrove,
    ];

    if (troveOperation === TroveOperation.OpenTrove) {
      return `+${LIQUIDATION_RESERVE_AMOUNT} ${SupportedTokens.zusd}`;
    }

    if (
      operations.some(item => item.includes(troveOperation)) ||
      (troveOperation === TroveOperation.RedeemCollateral &&
        redemption?.partial === true)
    ) {
      return `-${LIQUIDATION_RESERVE_AMOUNT} ${SupportedTokens.zusd}`;
    }

    return '-';
  }, []);

  const updateFilters = useCallback(
    (filterList: Filter[]) => {
      const previousFilters = { ...filters };

      filterList.forEach(filter => {
        delete previousFilters[filter.filter];
      });

      const updatedFilters = filterList
        .filter(f => f.checked)
        .reduce(
          (acc, filter) => ({
            ...acc,
            [filter.filter]:
              filter.filter === 'troveOperation_in'
                ? [...(acc[filter.filter] || []), filter.value]
                : filter.value,
          }),
          {},
        );
      setFilters({ ...previousFilters, ...updatedFilters });
    },
    [filters],
  );

  const renderSign = useCallback(
    (troveOperation: TroveOperation, value: number) => {
      const operations = [TroveOperation.OpenTrove, TroveOperation.AdjustTrove];

      if (operations.some(item => item.includes(troveOperation))) {
        return value > 0 ? '+' : '';
      }

      return null;
    },
    [],
  );

  const renderDebtChange = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.debtChange.length ? (
          <Tooltip
            content={
              <>
                {renderSign(
                  trove.troveOperation,
                  Number(trove.collateralAfter),
                )}
                {trove.debtChange} {SupportedTokens.zusd}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="debt-change-tooltip"
          >
            <span>
              {renderSign(trove.troveOperation, Number(trove.collateralAfter))}
              {formatValue(Number(trove.debtChange), 2)} {SupportedTokens.zusd}
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [renderSign],
  );

  const renderNewDebt = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.debtAfter.length ? (
          <Tooltip
            content={
              <>
                {trove.redemption?.partial === true ? 0 : trove.debtAfter}{' '}
                {SupportedTokens.zusd}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="collateral-change-tooltip"
          >
            <span>
              {trove.redemption?.partial === true
                ? 0
                : formatValue(Number(trove.debtAfter), 2)}{' '}
              {SupportedTokens.zusd}
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderCollateralChange = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.collateralChange.length ? (
          <Tooltip
            content={
              <>
                {renderSign(
                  trove.troveOperation,
                  Number(trove.collateralChange),
                )}
                {trove.collateralChange} {Bitcoin}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="collateral-change-tooltip"
          >
            <span>
              {renderSign(trove.troveOperation, Number(trove.collateralChange))}
              {formatValue(Number(trove.collateralChange), 6)} {Bitcoin}
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [renderSign],
  );

  const renderCollateralBalance = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.collateralAfter.length ? (
          <Tooltip
            content={
              <>
                {trove.redemption?.partial === true ? (
                  0
                ) : (
                  <>
                    {trove.troveOperation === TroveOperation.OpenTrove &&
                      renderSign(
                        trove.troveOperation,
                        Number(trove.collateralAfter),
                      )}
                    {trove.collateralAfter} {Bitcoin}
                  </>
                )}
              </>
            }
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="new-collateral-tooltip"
          >
            <span>
              {trove.redemption?.partial === true ? (
                0
              ) : (
                <>
                  {trove.troveOperation === TroveOperation.OpenTrove &&
                    renderSign(
                      trove.troveOperation,
                      Number(trove.collateralAfter),
                    )}
                  {formatValue(Number(trove.collateralAfter), 6)} {Bitcoin}
                </>
              )}
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [renderSign],
  );

  const renderOriginationFee = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.borrowingFee ? (
          <Tooltip
            content={`${trove.borrowingFee} ${SupportedTokens.zusd}`}
            trigger={TooltipTrigger.click}
            className="cursor-pointer uppercase"
            tooltipClassName="uppercase"
            dataAttribute="collateral-change-tooltip"
          >
            <span>
              {formatValue(Number(trove.borrowingFee), 2)}{' '}
              {SupportedTokens.zusd} (
              {formatValue(
                (Number(trove.borrowingFee) / Number(trove.debtAfter)) * 100,
                2,
              )}
              %)
            </span>
          </Tooltip>
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const generateRowTitle = useCallback(
    (trove: TroveChange) => {
      return (
        <Paragraph size={ParagraphSize.small}>
          {getTroveType(trove.troveOperation)} -{' '}
          {dateFormat(trove.transaction.timestamp)}
        </Paragraph>
      );
    },
    [getTroveType],
  );

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
        cellRenderer: (item: TroveChange) => getTroveType(item.troveOperation),
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
        cellRenderer: (item: TroveChange) => renderCollateralChange(item),
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
        cellRenderer: (item: TroveChange) => renderCollateralBalance(item),
      },
      {
        id: 'debtChange',
        title: t(translations.transactionHistory.table.debtChange),
        cellRenderer: (item: TroveChange) => renderDebtChange(item),
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
          <div className="uppercase">{renderLiquidationReserve(item)}</div>
        ),
      },
      {
        id: 'newDebt',
        title: t(translations.transactionHistory.table.newDebt),
        cellRenderer: (item: TroveChange) => renderNewDebt(item),
      },
      {
        id: 'originationFee',
        title: t(translations.transactionHistory.table.originationFee),
        cellRenderer: (item: TroveChange) => renderOriginationFee(item),
      },
      {
        id: 'transactionID',
        title: t(translations.transactionHistory.table.transactionID),
        cellRenderer: (item: TroveChange) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${item.transaction.id}`}
            value={item.transaction.id}
            dataAttribute="history-address-id"
          />
        ),
      },
    ],
    [
      chain,
      getTroveType,
      transactionTypeFilters,
      updateFilters,
      renderNewDebt,
      renderDebtChange,
      renderOriginationFee,
      renderCollateralBalance,
      renderCollateralChange,
      renderLiquidationReserve,
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
    [page, troves],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && (!troves || troves?.length < pageSize),
    [loading, troves],
  );

  const exportData = useCallback(async () => {
    const data = await getTroves({
      variables: {
        user: account,
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        orderBy: orderOptions.orderBy as TroveChange_OrderBy,
        orderDirection: orderOptions.orderDirection,
      },
      client: zeroClient,
    }).then(res => res.data);

    let troves = data?.trove?.changes || [];

    if (!troves || !troves.length || troves.length === 0) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.transactionHistory.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return troves.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      transactionType: getTroveType(tx.troveOperation),
      collateralChange: tx.collateralChange,
      newCollateralBalance: tx.collateralAfter,
      debtChange: tx.debtChange,
      liquidationReserveAmount: renderLiquidationReserve(tx),
      newDebtBalance: tx.debtAfter,
      originationFee: tx.borrowingFee || '-',
      transactionID: tx.transaction.id,
    }));
  }, [
    getTroves,
    account,
    orderOptions.orderBy,
    orderOptions.orderDirection,
    addNotification,
    getTroveType,
    renderLiquidationReserve,
  ]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions, filters]);

  return (
    <>
      <ExportCSV
        getData={exportData}
        filename="transactions"
        className="mb-7 hidden lg:inline-flex"
        disabled={!troves}
      />
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={troves}
          rowTitle={row => generateRowTitle(row)}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={noDataLabel}
          dataAttribute="transaction-history-table"
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          dataAttribute="transaction-history-pagination"
        />
      </div>
    </>
  );
};
