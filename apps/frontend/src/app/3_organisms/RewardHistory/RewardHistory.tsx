import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

import { SupportedTokens } from '@sovryn/contracts';
import {
  applyDataAttr,
  ErrorBadge,
  ErrorLevel,
  NotificationType,
  OrderDirection,
  OrderOptions,
  Pagination,
  Paragraph,
  ParagraphSize,
  Table,
  TransactionId,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';

import { AmountRenderer } from '../../2_molecules/AmountRenderer/AmountRenderer';
import { ExportCSV } from '../../2_molecules/ExportCSV/ExportCSV';
import { TransactionTypeRenderer } from '../../2_molecules/TransactionTypeRenderer/TransactionTypeRenderer';
import { useNotificationContext } from '../../../contexts/NotificationContext';
import { useAccount } from '../../../hooks/useAccount';
import { useMaintenance } from '../../../hooks/useMaintenance';
import { translations } from '../../../locales/i18n';
import { zeroClient } from '../../../utils/clients';
import {
  Bitcoin,
  DEFAULT_HISTORY_FRAME_PAGE_SIZE,
  EXPORT_RECORD_LIMIT,
} from '../../../utils/constants';
import {
  StabilityDepositChange,
  StabilityDepositChange_Filter,
  useGetStabilityDepositChangesLazyQuery,
} from '../../../utils/graphql/zero/generated';
import { dateFormat } from '../../../utils/helpers';
import { formatValue } from '../../../utils/math';
import { useGetRewardHistory } from './hooks/useGetRewardHistory';

const pageSize = DEFAULT_HISTORY_FRAME_PAGE_SIZE;

export const RewardHistory: FC = () => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const { addNotification } = useNotificationContext();

  const [page, setPage] = useState(0);
  const chain = chains.find(chain => chain.id === defaultChainId);

  const [orderOptions, setOrderOptions] = useState<OrderOptions>({
    orderBy: 'sequenceNumber',
    orderDirection: OrderDirection.Desc,
  });

  const { data, loading } = useGetRewardHistory(
    account,
    pageSize,
    page,
    orderOptions,
  );
  const [getStabilityDeposit] = useGetStabilityDepositChangesLazyQuery({
    client: zeroClient,
  });

  const renderCollateralChange = useCallback((collateralGain: string) => {
    return `${formatValue(
      Math.abs(Number(collateralGain)),
      8,
    )} ${SupportedTokens.rbtc.toUpperCase()}`;
  }, []);

  const generateRowTitle = useCallback((row: StabilityDepositChange) => {
    return (
      <Paragraph size={ParagraphSize.small}>
        <TransactionTypeRenderer type={row.stabilityDepositOperation} />
        {' - '}
        {dateFormat(row.transaction.timestamp)}
      </Paragraph>
    );
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'sequenceNumber',
        title: t(translations.rewardHistoryTable.table.timestamp),
        cellRenderer: (tx: StabilityDepositChange) =>
          dateFormat(tx.transaction.timestamp),
        sortable: true,
      },
      {
        id: 'stabilityDepositOperation',
        title: t(translations.rewardHistoryTable.table.transactionType),
        cellRenderer: (tx: StabilityDepositChange) => (
          <TransactionTypeRenderer type={tx.stabilityDepositOperation} />
        ),
      },
      {
        id: 'collateralGain',
        title: t(translations.rewardHistoryTable.table.rewardChange),
        cellRenderer: tx => (
          <AmountRenderer
            value={tx.collateralGain || 0}
            suffix={Bitcoin}
            precision={8}
            dataAttribute="reward-history-collateral-gain"
          />
        ),
      },
      {
        id: 'transactionID',
        title: t(translations.rewardHistoryTable.table.transactionID),
        cellRenderer: (tx: StabilityDepositChange) => (
          <TransactionId
            href={`${chain?.blockExplorerUrl}/tx/${tx.transaction.id}`}
            value={tx.transaction.id}
            dataAttribute="history-reward-address-id"
          />
        ),
      },
    ],
    [chain?.blockExplorerUrl, t],
  );

  const onPageChange = useCallback(
    (value: number) => {
      if (data?.length < pageSize && value > page) {
        return;
      }
      setPage(value);
    },
    [page, data],
  );

  const isNextButtonDisabled = useMemo(
    () => !loading && data?.length < pageSize,
    [loading, data],
  );

  const exportData = useCallback(async () => {
    const { data } = await getStabilityDeposit({
      variables: {
        skip: 0,
        filters: {
          stabilityDepositOperation_in: [
            'withdrawGainToLineOfCredit',
            'withdrawCollateralGain',
          ],
          stabilityDeposit: account,
        } as StabilityDepositChange_Filter,
        pageSize: EXPORT_RECORD_LIMIT,
      },
    });
    let list = data?.stabilityDepositChanges || [];

    if (!list || !list.length) {
      addNotification({
        type: NotificationType.warning,
        title: t(translations.rewardHistoryTable.actions.noDataToExport),
        content: '',
        dismissible: true,
        id: nanoid(),
      });
    }

    return list.map(tx => ({
      timestamp: dateFormat(tx.transaction.timestamp),
      collateralGain: renderCollateralChange(tx.collateralGain || ''),
      stabilityDepositOperation: tx.stabilityDepositOperation,
      transactionID: tx.transaction.id,
    }));
  }, [
    account,
    addNotification,
    getStabilityDeposit,
    renderCollateralChange,
    t,
  ]);

  useEffect(() => {
    setPage(0);
  }, [orderOptions]);

  const { checkMaintenance, States } = useMaintenance();
  const exportLocked = checkMaintenance(States.ZERO_EXPORT_CSV);

  return (
    <>
      <div className="flex flex-row items-center gap-4 mb-7 hidden lg:inline-flex">
        <ExportCSV
          getData={exportData}
          filename="rewards"
          disabled={!data || data.length === 0 || exportLocked}
        />
        {exportLocked && (
          <ErrorBadge
            level={ErrorLevel.Warning}
            message={t(translations.maintenanceMode.featureDisabled)}
          />
        )}
      </div>
      <div className="bg-gray-80 py-4 px-4 rounded">
        <Table
          setOrderOptions={setOrderOptions}
          orderOptions={orderOptions}
          columns={columns}
          rows={data}
          rowTitle={generateRowTitle}
          isLoading={loading}
          className="bg-gray-80 text-gray-10 lg:px-6 lg:py-4"
          noData={t(translations.common.tables.noData)}
          {...applyDataAttr('reward-history-table')}
        />
        <Pagination
          page={page}
          className="lg:pb-6 mt-3 lg:mt-6 justify-center lg:justify-start"
          onChange={onPageChange}
          itemsPerPage={pageSize}
          isNextButtonDisabled={isNextButtonDisabled}
          {...applyDataAttr('reward-history-pagination')}
        />
      </div>
    </>
  );
};
