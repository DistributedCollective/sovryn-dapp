import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  ErrorBadge,
  ErrorLevel,
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { AmountRenderer } from '../../../../2_molecules/AmountRenderer/AmountRenderer';
import { ExportCSV } from '../../../../2_molecules/ExportCSV/ExportCSV';
import { TableFilter } from '../../../../2_molecules/TableFilter/TableFilter';
import { Filter } from '../../../../2_molecules/TableFilter/TableFilter.types';
import { TxIdWithNotification } from '../../../../2_molecules/TxIdWithNotification/TransactionIdWithNotification';
import { useLiquityBaseParams } from '../../../../5_pages/ZeroPage/hooks/useLiquityBaseParams';
import {
  BITCOIN,
  BTC_RENDER_PRECISION,
  TOKEN_RENDER_PRECISION,
} from '../../../../../constants/currencies';
import {
  LIQUIDATION_RESERVE_AMOUNT,
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../../../constants/general';
import { getTokenDisplayName } from '../../../../../constants/tokens';
import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { useAccount } from '../../../../../hooks/useAccount';
import { useBlockNumber } from '../../../../../hooks/useBlockNumber';
import { useMaintenance } from '../../../../../hooks/useMaintenance';
import { translations } from '../../../../../locales/i18n';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { getChainById } from '../../../../../utils/chain';
import { zeroClient } from '../../../../../utils/clients';
import {
  InputMaybe,
  TroveChange,
  TroveChange_Filter,
  TroveChange_OrderBy,
  TroveOperation,
  useGetTroveLazyQuery,
} from '../../../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../../../utils/helpers';
import { useGetTroves } from './hooks/useGetTroves';
import { renderSign } from './utils';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const TransactionHistoryFrame: FC<PropsWithChildren> = ({
  children,
}) => {
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();
  const [page, setPage] = useState(0);
  const chain = getChainById(RSK_CHAIN_ID);
  const [filters, setFilters] = useState<InputMaybe<TroveChange_Filter>>({});

  const { value: block } = useBlockNumber();

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);
  const { minBorrowingFeeRate } = useLiquityBaseParams();

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
        return t(translations.transactionHistory.troveTypes.redistribution);
      case TroveOperation.TransferGainToLineOfCredit:
        return t(
          translations.transactionHistory.troveTypes.transferGainToLineOfCredit,
        );
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
        checked: (filters || {}).hasOwnProperty('collateralChange_gte'),
      },
      {
        label: t(translations.transactionHistory.filters.decreasedCollateral),
        filter: 'collateralChange_lte',
        value: 0,
        checked: (filters || {}).hasOwnProperty('collateralChange_lte'),
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
        checked: (filters || {}).hasOwnProperty('debtChange_gte'),
      },
      {
        label: t(translations.transactionHistory.filters.decreasedDebt),
        filter: 'debtChange_lte',
        value: 0,
        checked: (filters || {}).hasOwnProperty('debtChange_lte'),
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

  const renderLiquidationReserve = useCallback((trove, isCsvExport?) => {
    const { troveOperation, redemption } = trove;
    const operations = [
      TroveOperation.LiquidateInNormalMode,
      TroveOperation.LiquidateInRecoveryMode,
      TroveOperation.CloseTrove,
    ];

    if (troveOperation === TroveOperation.OpenTrove) {
      return `+${LIQUIDATION_RESERVE_AMOUNT} ${
        isCsvExport ? '' : COMMON_SYMBOLS.ZUSD
      }`;
    }

    if (
      operations.some(item => item.includes(troveOperation)) ||
      (troveOperation === TroveOperation.RedeemCollateral &&
        redemption?.partial === true)
    ) {
      return `-${LIQUIDATION_RESERVE_AMOUNT} ${
        isCsvExport ? '' : COMMON_SYMBOLS.ZUSD
      }`;
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

  const renderDebtChange = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.debtChange.length ? (
          <AmountRenderer
            value={trove.debtChange}
            suffix={COMMON_SYMBOLS.ZUSD}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="transaction-history-debt-change"
            prefix={renderSign(trove.debtChange, trove.troveOperation)}
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderNewDebt = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.debtAfter.length ? (
          <AmountRenderer
            value={trove.debtAfter}
            suffix={COMMON_SYMBOLS.ZUSD}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="transaction-history-new-debt"
          />
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
          <AmountRenderer
            value={trove.collateralChange}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="transaction-history-collateral-change"
            prefix={renderSign(trove.collateralChange, trove.troveOperation)}
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderCollateralBalance = useCallback(
    (trove: TroveChange) => (
      <>
        {trove.collateralAfter.length ? (
          <AmountRenderer
            value={trove.collateralAfter}
            suffix={BITCOIN}
            precision={BTC_RENDER_PRECISION}
            dataAttribute="transaction-history-collateral-balance"
          />
        ) : (
          '-'
        )}
      </>
    ),
    [],
  );

  const renderOriginationFee = useCallback(
    ({ borrowingFee, debtChange }: TroveChange) => {
      if (!borrowingFee || Number(borrowingFee) === 0) {
        return '-';
      }

      return (
        <>
          <AmountRenderer
            value={borrowingFee}
            suffix={COMMON_SYMBOLS.ZUSD}
            precision={TOKEN_RENDER_PRECISION}
            dataAttribute="transaction-history-borrowing-fee"
          />{' '}
          ({minBorrowingFeeRate.mul(100).toString()}%)
        </>
      );
    },
    [minBorrowingFeeRate],
  );

  const generateRowTitle = useCallback(
    (trove: TroveChange) => (
      <Paragraph size={ParagraphSize.small} className="text-left">
        {getTroveType(trove.troveOperation)}
        {' - '}
        {dateFormat(trove.transaction.timestamp)}
      </Paragraph>
    ),
    [getTroveType],
  );

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.common.tables.columnTitles.timestamp),
        cellRenderer: (item: TroveChange) =>
          dateFormat(item.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'transactionType',
        title: t(translations.common.tables.columnTitles.transactionType),
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
        id: 'originationFee',
        title: t(translations.transactionHistory.table.originationFee),
        cellRenderer: (item: TroveChange) => renderOriginationFee(item),
      },
      {
        id: 'newDebt',
        title: t(translations.transactionHistory.table.newDebt),
        cellRenderer: (item: TroveChange) => renderNewDebt(item),
      },
      {
        id: 'transactionID',
        title: t(translations.common.tables.columnTitles.transactionID),
        cellRenderer: (item: TroveChange) => (
          <TxIdWithNotification
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
        skip: 0,
        pageSize: EXPORT_RECORD_LIMIT,
        user: account?.toLowerCase(),
        orderBy: (orderOptions.orderBy as TroveChange_OrderBy) || undefined,
        orderDirection: orderOptions.orderDirection || undefined,
        filters,
      },
      client: zeroClient,
    }).then(res => res.data);

    let troves = data?.trove?.changes || [];

    if (!troves || !troves.length || troves.length === 0) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.common.tables.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return troves.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      transactionType: getTroveType(tx.troveOperation),
      collateralChange: tx.collateralChange,
      collateralChangeToken: BITCOIN,
      newCollateralBalance: tx.collateralAfter,
      newCollateralBalanceToken: BITCOIN,
      debtChange: tx.debtChange,
      debtChangeToken: getTokenDisplayName(COMMON_SYMBOLS.ZUSD),
      liquidationReserveAmount: renderLiquidationReserve(tx, true),
      liquidationReserveAmountToken: getTokenDisplayName(COMMON_SYMBOLS.ZUSD),
      newDebtBalance: tx.debtAfter,
      newDebtBalanceToken: getTokenDisplayName(COMMON_SYMBOLS.ZUSD),
      originationFee: tx.borrowingFee || '-',
      originationFeeToken: getTokenDisplayName(COMMON_SYMBOLS.ZUSD),
      transactionID: tx.transaction.id,
    }));
  }, [
    getTroves,
    account,
    orderOptions.orderBy,
    orderOptions.orderDirection,
    filters,
    addNotification,
    getTroveType,
    renderLiquidationReserve,
  ]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions, filters]);

  return (
    <>
      <div className="flex-row items-center gap-4 mb-7 flex justify-center lg:justify-start">
        {children}
        <div className="flex-row items-center ml-2 gap-4 hidden lg:inline-flex">
          <ExportCSV
            getData={exportData}
            filename="transactions"
            disabled={!troves || troves?.length < 1 || exportLocked}
          />
          {exportLocked && (
            <ErrorBadge
              level={ErrorLevel.Warning}
              message={t(translations.maintenanceMode.featureDisabled)}
            />
          )}
        </div>
      </div>

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
          loadingData={t(translations.common.tables.loading)}
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
